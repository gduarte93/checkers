var React          = require('react'),
    Component      = React.Component,
    Square         = require('../Square/index.jsx'),
    Header         = require('../Header/index.jsx'),
    Banner         = require('../Banner/index.jsx'),

    MAX_SIZE       = 8,
    MIN_SIZE       = -1,
    CHECKERS_STATE = 'checkers_state';

require('./Board.css');

class Board extends Component {
    constructor(props) {
        super(props);
        var localStorage = window && window.localStorage,
            savedState   = localStorage.getItem(CHECKERS_STATE),
            parsedState  = JSON.parse(savedState);

        this.moveablePiece = React.createRef();

        this.highlightSquare      = this.highlightSquare.bind(this);
        this.stopHighlighting     = this.stopHighlighting.bind(this);
        this.handlePieceClick     = this.handlePieceClick.bind(this);
        this.mouseMoveEvent       = this.mouseMoveEvent.bind(this);
        this.removeMouseMoveEvent = this.removeMouseMoveEvent.bind(this);
        this.turnEnd              = this.turnEnd.bind(this);
        this.initBoard            = this.initBoard.bind(this);
        this.getPieceData         = this.getPieceData.bind(this);
        this.setMoves             = this.setMoves.bind(this);
        this.handleTileClick      = this.handleTileClick.bind(this);
        this.movePiece            = this.movePiece.bind(this);
        this.reduceMoves          = this.reduceMoves.bind(this);
        this.checkAI              = this.checkAI.bind(this);
        this.initTimer            = this.initTimer.bind(this);
        this.restartGame          = this.restartGame.bind(this);
        this.getInitialState      = this.getInitialState.bind(this);
        this.saveToLocalStorage   = this.saveToLocalStorage.bind(this);
        this.addToHistory         = this.addToHistory.bind(this);
        this.undoMoves            = this.undoMoves.bind(this);
        this.declareWinner        = this.declareWinner.bind(this);
        
        this.state = parsedState || this.getInitialState();
    }

    getInitialState() {
        return {
            currentPlayer : 2,
            timer         : 0,
            moving        : false,
            history       : [],
            winner        : false,
            player        : {
                '1' : { moves: 0 },
                '2' : { moves: 0 }
            },
            squares       : {}, // create dynamically with initBoard
            pieces        : {
                '1'  : { id: '1',  player: 1, square: 's01', king: false, moves: [] },
                '2'  : { id: '2',  player: 1, square: 's03', king: false, moves: [] },
                '3'  : { id: '3',  player: 1, square: 's05', king: false, moves: [] },
                '4'  : { id: '4',  player: 1, square: 's07', king: false, moves: [] },
                '5'  : { id: '5',  player: 1, square: 's10', king: false, moves: [] },
                '6'  : { id: '6',  player: 1, square: 's12', king: false, moves: [] },
                '7'  : { id: '7',  player: 1, square: 's14', king: false, moves: [] },
                '8'  : { id: '8',  player: 1, square: 's16', king: false, moves: [] },
                '9'  : { id: '9',  player: 1, square: 's21', king: false, moves: [] },
                '10' : { id: '10', player: 1, square: 's23', king: false, moves: [] },
                '11' : { id: '11', player: 1, square: 's25', king: false, moves: [] },
                '12' : { id: '12', player: 1, square: 's27', king: false, moves: [] },
                '13' : { id: '13', player: 2, square: 's70', king: false, moves: [] },
                '14' : { id: '14', player: 2, square: 's72', king: false, moves: [] },
                '15' : { id: '15', player: 2, square: 's74', king: false, moves: [] },
                '16' : { id: '16', player: 2, square: 's76', king: false, moves: [] },
                '17' : { id: '17', player: 2, square: 's61', king: false, moves: [] },
                '18' : { id: '18', player: 2, square: 's63', king: false, moves: [] },
                '19' : { id: '19', player: 2, square: 's65', king: false, moves: [] },
                '20' : { id: '20', player: 2, square: 's67', king: false, moves: [] },
                '21' : { id: '21', player: 2, square: 's50', king: false, moves: [] },
                '22' : { id: '22', player: 2, square: 's52', king: false, moves: [] },
                '23' : { id: '23', player: 2, square: 's54', king: false, moves: [] },
                '24' : { id: '24', player: 2, square: 's56', king: false, moves: [] }
            }
        };
    }

    componentDidMount() {
        var me     = this,
            state  = me && me.state,
            winner = state && state.winner;

        me.initBoard();
        !winner && me.initTimer();

        window.addEventListener('beforeunload', me.saveToLocalStorage);
    }

    componentWillUnmount() {
        var me = this;

        window.removeEventListener('beforeunload', me.saveToLocalStorage);
    }

    saveToLocalStorage() {
        var me    = this,
            state = me && me.state;

        window && window.localStorage && window.localStorage.setItem(CHECKERS_STATE, JSON.stringify(state));
    }

    initTimer() {
        var me = this;

        me.time = setInterval(() => {
            me.setState({ timer: me.state.timer + 1 });
        }, 1000);
    }

    restartGame() {
        var me           = this,
            initialState = me.getInitialState();

        clearInterval(me.time);
        me.setState(initialState, me.initBoard, me.initTimer());
    }

    undoMoves() {
        var me         = this,
            state      = me && me.state,
            history    = state && state.history,
            firstItem  = history && history[0],
            parsedItem = firstItem && JSON.parse(firstItem),
            newPlayer  = parsedItem && parsedItem.player,
            newPieces  = parsedItem && parsedItem.pieces;

        if (!history.length) return;

        me.setState({ player: newPlayer, pieces: newPieces, history: [] }, me.initBoard);
    }

    initBoard() {
        var me      = this,
            state   = me && me.state,
            squares = state && state.squares;

        for (var y = 0; y < MAX_SIZE; y++ ) {
            var evenRow = y % 2 === 0;

            for (var x = 0; x < MAX_SIZE; x++ ) {
                var currentSquare = `s${y}${x}`,
                    color;

                if (evenRow) {
                    color = x % 2 === 0 ? 'light' : 'dark';
                } else {
                    color = x % 2 === 1 ? 'light' : 'dark';
                }

                squares[currentSquare] = { piece: false, highlight: false, color };
            }
        }

        me.setState({ squares }, me.initPieces());
    }

    initPieces() {
        var me      = this,
            state   = me && me.state,
            squares = state && state.squares,
            pieces  = state && state.pieces,
            ids     = Object.keys(pieces);

        ids.forEach(id => {
            var piece  = pieces[id],
                square = piece && piece.square;

            squares[square].piece = id;
        });

        me.setState({ squares }, me.setMoves());
    }

    setMoves() {
        var me            = this,
            state         = me && me.state,
            squares       = state && state.squares,
            pieces        = state && state.pieces,
            ids           = Object.keys(pieces),
            xModifier     = {
                0: -1,
                1: 1
            },
            yModifier     = {
                1: 1,
                2: -1
            },
            hasMoves      = {
                1: false,
                2: false
            };

        ids.forEach(id => {
            var piece       = pieces[id],
                playerPiece = piece && piece.player,
                king        = piece && piece.king,
                square      = piece && piece.square,
                parseSq     = square.match(/^s(\d)(\d)$/),
                posY        = parseInt(parseSq[1]),
                posX        = parseInt(parseSq[2]),
                moves       = [];

                for (var i = 0; i < 2; i++) {
                    var nextY       = posY + yModifier[playerPiece],
                        nextX       = posX + xModifier[i],
                        newSpot     = `s${nextY}${nextX}`,
                        nextSquare  = squares && squares[newSpot],
                        pieceInSpot = nextSquare && nextSquare.piece,
                        thatPiece   = pieceInSpot && me.getPieceData(pieceInSpot),
                        thatPlayer  = thatPiece && thatPiece.player,
                        jump        = false,
                        move        = {};
    
                    if (thatPlayer && thatPlayer != playerPiece) {
                        nextY = nextY + yModifier[playerPiece];
                        nextX = nextX + xModifier[i];
                        jump = newSpot;
                        newSpot = `s${nextY}${nextX}`;
                        nextSquare = squares && squares[newSpot],
                        pieceInSpot = nextSquare && nextSquare.piece;
                    }
    
                    if (pieceInSpot || nextY >= MAX_SIZE || nextY <= MIN_SIZE || nextX >= MAX_SIZE || nextX <= MIN_SIZE) continue;
                    
                    hasMoves[playerPiece] = true;

                    move = {
                        to: newSpot,
                        jump
                    };

                    moves.push(move);
                }

                if (king) {
                    for (var i = 0; i < 2; i++) {
                        var nextY       = posY - yModifier[playerPiece],
                            nextX       = posX + xModifier[i],
                            newSpot     = `s${nextY}${nextX}`,
                            nextSquare  = squares && squares[newSpot],
                            pieceInSpot = nextSquare && nextSquare.piece,
                            thatPiece   = pieceInSpot && me.getPieceData(pieceInSpot),
                            thatPlayer  = thatPiece && thatPiece.player,
                            jump        = false,
                            move        = {};
    
                        if (thatPlayer && thatPlayer !== playerPiece) {
                            nextY = nextY - yModifier[playerPiece];
                            nextX = nextX + xModifier[i];
                            jump = newSpot;
                            newSpot = `s${nextY}${nextX}`;
                            nextSquare = squares && squares[newSpot],
                            pieceInSpot = nextSquare && nextSquare.piece;
                        }

                        if (pieceInSpot || nextY >= MAX_SIZE || nextY <= MIN_SIZE || nextX >= MAX_SIZE || nextX <= MIN_SIZE) continue;
                        
                        hasMoves[playerPiece] = true;

                        move = {
                            to: newSpot,
                            jump
                        };
    
                        moves.push(move);
                    }
                }

            pieces[id].moves = moves;

        });

        if (!hasMoves[1]) {
            me.declareWinner(2);
        } else if (!hasMoves[2]) {
            me.declareWinner(1);
        }

        me.setState({ pieces }, me.reduceMoves());

    }

    // Force jumps when possible
    reduceMoves() {
        var me        = this,
            state     = me && me.state,
            pieces    = state && state.pieces,
            ids       = Object.keys(pieces),
            p1jumps   = false,
            p2jumps   = false,
            jumpMoves = {},
            jumpIds;

        ids.forEach(id => {
            var piece  = pieces[id],
                player = piece && piece.player,
                moves  = piece && piece.moves;

            moves.forEach(move => {
                if (move && move.jump) {
                    p1jumps = p1jumps || player == 1;
                    p2jumps = p2jumps || player == 2;

                    if (jumpMoves[id]) {
                        jumpMoves[id].push(move)
                    } else {
                        jumpMoves[id] = [move];
                    }
                }
            });
        });

        jumpIds = Object.keys(jumpMoves);
        if (jumpIds.length) {
            ids.forEach(id => {
                var piece   = pieces[id],
                    player  = piece && piece.player,
                    noClear = player == 1 && !p1jumps || player == 2 && !p2jumps;

                pieces[id].moves = jumpMoves[id] || noClear && pieces[id].moves || [];
            });
        }

        me.setState({ pieces })
    }

    addToHistory(newState) {
        var me      = this,
            state   = me && me.state,
            history = state && state.history,
            player  = newState && newState.player,
            pieces  = newState && newState.pieces;

        history.push(JSON.stringify({player, pieces}));

        while (history.length > 2) {
            history.shift();
        }

        me.setState({ history });
    }

    movePiece(piece, from, move) {
        var me            = this,
            state         = me && me.state,
            squares       = state && state.squares,
            pieces        = state && state.pieces,
            playersMoves  = state && state.player,
            to            = move && move.to,
            jump          = move && move.jump,
            jumpedSquare  = squares[jump],
            jumpedPieceId = jumpedSquare && jumpedSquare.piece,
            pieceObj      = pieces && pieces[piece],
            player        = pieceObj && pieceObj.player,
            king          = pieceObj && pieceObj.king;

        me.addToHistory({player: playersMoves, pieces});

        if (player == 1 && (/^s7/).test(to) || player == 2 && (/^s0/).test(to)) {
            king = true;
        }

        pieces[piece].square = to;
        pieces[piece].king = king;
        squares[from].piece = false;
        squares[to].piece = piece;

        if (jump) {
            squares[jump].piece = false;
            delete pieces[jumpedPieceId];
        }

        me.setState({ pieces, squares }, me.setMoves, me.turnEnd());
    }

    checkAI() {
        var me            = this,
            state         = me && me.state,
            currentPlayer = state && state.currentPlayer,
            isAITurn      = currentPlayer == 1,
            pieces        = state && state.pieces,
            ids           = Object.keys(pieces);

        if (!isAITurn) return;

        setTimeout(() => {
            for (var i = 0; i < ids.length; i++) {
                var id     = ids[i],
                    piece  = pieces && pieces[id],
                    player = piece && piece.player,
                    moves  = piece && piece.moves,
                    square = piece && piece.square;
    
                if (player == currentPlayer && moves.length) {
                    if (!me.AIismoving) {
                        me.AIismoving = true;
                        me.movePiece(id, square, moves[0]);
                    }
                    break;
                }
            }
            
            me.AIismoving = false;
        }, 500);
    }

    turnEnd() {
        var me                 = this,
            state              = me && me.state,
            player             = state && state.currentPlayer,
            newPlayer          = player == 1 ? 2 : 1,
            playerStats        = state && state.player,
            currentPlayerStats = playerStats && playerStats[player],
            moves              = currentPlayerStats && currentPlayerStats.moves;

        playerStats[player] = { moves: moves + 1 };

        me.setState({ currentPlayer: newPlayer, player: playerStats }, me.checkAI);
    }

    removeMouseMoveEvent() {
        var me = this;

        document.removeEventListener('mousemove', me.mouseMoveEvent);
        me.moveablePiece.current.style.display = 'none';
        me.setState({ moving: false });
    }

    highlightSquare(id) {
        var me      = this,
            state   = me && me.state,
            squares = state && state.squares,
            moving  = state && state.moving,
            validSquare = squares[id];

        if (moving) return;

        if (validSquare) {
            squares[id].highlight = true;
            me.highlighting = true;

            me.setState({ squares });
        }
    }

    stopHighlighting() {
        var me      = this,
            state   = me && me.state,
            squares = state && state.squares,
            ids     = Object.keys(squares),
            moving  = state && state.moving;

        if (!me.highlighting) return;

        ids.forEach(id => {
            squares[id].highlight = false;
        });

        me.highlighting = false;
        !moving && me.setState({ squares });
    }

    handlePieceClick(event, id) {
        var me            = this,
            state         = me && me.state,
            alreadyMoving = state && state.moving,
            currentPlayer = state && state.currentPlayer,
            piece         = me.getPieceData(id),
            moves         = piece && piece.moves,
            hasMoves      = moves && moves.length,
            playerPiece   = piece && piece.player,
            mouseY        = event.clientY,
            mouseX        = event.clientX;

        if (alreadyMoving || currentPlayer != playerPiece || !hasMoves) return;

        document.addEventListener('mousemove', me.mouseMoveEvent);
        me.moveablePiece.current.style.top  = `${mouseY}px`;
        me.moveablePiece.current.style.left = `${mouseX}px`;
        document.dispatchEvent(new Event('mousemove'));

        me.setState({ moving: id });
    }

    handleTileClick(id) {
        var me     = this,
            state  = me && me.state,
            moving = state && state.moving,
            piece  = me.getPieceData(moving),
            moves  = piece && piece.moves,
            from   = piece && piece.square;

        if (!moving) return;

        moves.forEach(move => {
            var to = move && move.to;

            if (to == id) {
                me.movePiece(moving, from, move);
            }
        });

        me.removeMouseMoveEvent();
    }

    mouseMoveEvent(event) {
        var me      = this,
            state   = me && me.state,
            player  = state && state.currentPlayer,
            clientY = event && event.clientY,
            clientX = event && event.clientX;

        me.moveablePiece.current.style.top  = `${clientY}px`;
        me.moveablePiece.current.style.left = `${clientX}px`;
        me.moveablePiece.current.dataset.player = player;
        me.moveablePiece.current.style.display = 'block';
    }

    getPieceData(id) {
        var me     = this,
            state  = me && me.state,
            pieces = state && state.pieces;

        return pieces && pieces[id];
    }

    declareWinner(player) {
        var me = this;

        clearInterval(me.time);
        me.setState({ history: [], winner: player });
    }

    render() {
        var me            = this,
            state         = me && me.state,
            moving        = state && state.moving,
            squares       = state && state.squares,
            currentPlayer = state && state.currentPlayer,
            timer         = state && state.timer,
            moves         = state && state.player,
            history       = state && state.history,
            winner        = state && state.winner,
            hasHistory    = history && history.length,
            redMoves      = moves && moves[2].moves,
            whiteMoves    = moves && moves[1].moves,
            sqIds         = Object.keys(squares),
            clickPiece    = <div className="Board__piece Board__piece--container"><div className='Board__piece Board__piece--moving' ref={this.moveablePiece} data-player={1}/></div>;

        return (
            <React.Fragment>
                <Header
                    timer={timer}
                    currentPlayer={currentPlayer}
                    redMoves={redMoves}
                    whiteMoves={whiteMoves}
                    restartGame={me.restartGame}
                    undoMoves={me.undoMoves}
                    hasHistory={hasHistory}
                />
                { winner && <Banner winner={winner} /> }
                <div className="Board">
                    { clickPiece }
                    {
                        squares && sqIds.map((id, idx) => {
                            var square = squares[id];

                            return (
                                square && <Square
                                            key={idx}
                                            id={id}
                                            getPieceData={me.getPieceData}
                                            highlightSquare={me.highlightSquare}
                                            stopHighlighting={me.stopHighlighting}
                                            handlePieceClick={me.handlePieceClick}
                                            handleTileClick={me.handleTileClick}
                                            moving={moving}
                                            currentPlayer={currentPlayer}
                                            {...square}
                                        />
                                );
                        })
                    }
                </div>
            </React.Fragment>
        );
    }
}

module.exports = Board;
