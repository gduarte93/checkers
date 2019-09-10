var React    = require('react'),
    ReactDOM = require('react-dom'),
    App      = require('./index.jsx');

it('renders without crashing', () => {
    var div = document.createElement('div');
    
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});
