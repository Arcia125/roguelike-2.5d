const React = require('react');

class Game extends React.Component {
	render() {
		let classes = [];
		if (this.props.className) {
			classes.push(this.props.className);
		}
		classes.push('game');
		return (
			<div className={classes.join(' ')}>
			hello world
			</div>
			);
	}
}

export default Game;