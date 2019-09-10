var React = require('react');

require('./Header.css');

function Header(props) {
    var timer         = props && props.timer,
        currentPlayer = props && props.currentPlayer,
        restartGame   = props && props.restartGame,
        redMoves      = props && props.redMoves,
        whiteMoves    = props && props.whiteMoves,
        undoMoves     = props && props.undoMoves,
        hasHistory    = props && props.hasHistory;

    return (
        <div className="Header">
            <div className="Header__left">
                <div className="Header__time">Time: {timer}s</div>
                <div className="Header__turn">Turn: <span className={currentPlayer == 2 ? 'Header__turn--red' : 'Header__turn--white'}>{currentPlayer == 2 ? 'Red' : 'White'}</span></div>
            </div>
            <div className="Header__middle">
                <div className="Header__button Header__button--restart" onClick={restartGame}>RESTART</div>
                <div className={`Header__button Header__button--undo ${!hasHistory && 'Header__button--disabled'}`} onClick={undoMoves}>UNDO</div>
            </div>
            <div className="Header__right">
                <div className="Header__moves">Red Moves: {redMoves}</div>
                <div className="Header__moves">White Moves: {whiteMoves}</div>
            </div>
        </div>
    );
}

module.exports = Header;
