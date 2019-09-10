var React     = require('react'),
    ReactDOM  = require('react-dom'),
    TestUtils = require('react-dom/test-utils'),
    Board     = require('./index.jsx');

it('renders without crashing', () => {
    var div = document.createElement('div');
    
    ReactDOM.render(<Board />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('has 64 squares', () => {
    var board        = TestUtils.renderIntoDocument(<Board />),
        squares      = TestUtils.scryRenderedDOMComponentsWithClass(board, 'Board__square'),
        squareLength = squares && squares.length;

    expect(squareLength).toEqual(64);
});

it('has 24 pieces (12 per player)', () => {
    var board        = TestUtils.renderIntoDocument(<Board />),
        pieces       = TestUtils.scryRenderedDOMComponentsWithClass(board, 'Board__piece'),
        playerPieces = {
            1: 0,
            2: 0
        };

        pieces.forEach(node => {
            var dataset = node && node.dataset,
                player  = dataset && dataset.player;

            if (player) {
                playerPieces[player] += 1;
            }
        });

    expect(playerPieces[1]).toEqual(13); // the fake piece used for drag/drop starts as player 1
    expect(playerPieces[2]).toEqual(12);
});
