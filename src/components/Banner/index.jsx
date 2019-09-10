var React = require('react');

require('./Banner.css');

function Banner(props) {
    var winner     = props && props.winner,
        winnerText = winner == 1 ? 'White' : 'Red';

    return(
        <div className={`Banner Banner--${winner}`}>
            <div className="Banner__text">{winnerText} Wins!</div>
        </div>
    );
}

module.exports = Banner;
