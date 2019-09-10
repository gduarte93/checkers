var React = require('react'),
    Piece = require('../Piece/index.jsx');

require('./Square.css');

function Square(props) {
    var id               = props && props.id,
        color            = props && props.color,
        piece            = props && props.piece,
        highlight        = props && props.highlight,
        getPieceData     = props && props.getPieceData,
        pieceData        = getPieceData(piece),
        highlightSquare  = props && props.highlightSquare,
        stopHighlighting = props && props.stopHighlighting,
        handlePieceClick = props && props.handlePieceClick,
        handleTileClick  = props && props.handleTileClick,
        moving           = props && props.moving,
        currentPlayer    = props && props.currentPlayer;

    return (
        <div
            className={`Board__square Board__square--${color} ${highlight && 'Board__square--highlight'}`}
            onClick={() => handleTileClick(id)}
            onMouseUp={() => handleTileClick(id)}
        >
            {
                piece && <Piece
                            id={piece}
                            highlightSquare={highlightSquare}
                            stopHighlighting={stopHighlighting}
                            handlePieceClick={handlePieceClick}
                            moving={moving}
                            currentPlayer={currentPlayer}
                            {...pieceData}
                        />
            }
        </div>
    );
}

module.exports = Square;
