var React = require('react');

require('./Piece.css');

function Piece(props) {
    var player           = props && props.player,
        king             = props && props.king,
        id               = props && props.id,
        moves            = props && props.moves,
        highlightSquare  = props && props.highlightSquare,
        stopHighlighting = props && props.stopHighlighting,
        handlePieceClick = props && props.handlePieceClick,
        moving           = props && props.moving,
        currentPlayer    = props && props.currentPlayer,
        isCurrentPlayer  = currentPlayer == player;

    return (
        <div
            className={`Board__piece ${moving == id && 'Board__piece--clicked'}`}
            data-player={player}
            data-king={king}
            id={id}
            onMouseEnter={() => isCurrentPlayer && moves.forEach(move => move.to && highlightSquare(move.to))}
            onMouseLeave={stopHighlighting}
            onMouseDown={(event) => handlePieceClick(event, id)}
            onClick={(event) => handlePieceClick(event, id)}
        />
    );
}

module.exports = Piece;
