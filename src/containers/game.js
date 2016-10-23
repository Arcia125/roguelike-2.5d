import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions
import {
	dealDmg,
	updateBoard,
	move,
} from '../actions';

// components
import Hud from '../components/hud';
import Screen from '../components/screen';

// logic
import {
	generateRandomMap,
} from '../logic/level';



// direction variables
const dir = {
	up: {
		xDir: 0,
		yDir: -1,
	},
	right: {
		xDir: 1,
		yDir: 0,
	},
	down: {
		xDir: 0,
		yDir: 1,
	},
	left: {
		xDir: -1,
		yDir: 0,
	},
};

// key variables
const moves = {
	'87': dir.up,
	'38': dir.up,
	'68': dir.right,
	'39': dir.right,
	'83': dir.down,
	'40': dir.down,
	'65': dir.left,
	'37': dir.left,
};

class Game extends Component {
	componentWillMount() {
		this.startLevel();
		window.addEventListener('keydown', this.debounce(this.handleKeys.bind(this), 1), true);
	}

	debounce(func, delay) {
		let timer = null;
		return function(...args) {
			let context = this;
			clearTimeout(timer);
			timer = setTimeout(function() {
				func.apply(context, args);
			}, delay);
		};
	}

	handleKeys(keyEvent) {
		if (keyEvent.keyCode == 85) {
			this.props.updateBoard(generateRandomMap());
			// console.log(`updating map because you pressed U`);
		}
		const move = moves[keyEvent.keyCode];
		if (move) {
			this.checkMove(move);
		}
	}

	startLevel() {
		let newMap = generateRandomMap();
		const { enemies, weapons, health } = this.getObjectsFromMap(newMap);
		console.log(enemies);
		console.log(weapons);
		console.log(health);
		this.props.updateBoard(newMap);
	}

	getObjectsFromMap(generatedMap) {
		let enemies = [];
		let weapons = [];
		let health = [];
		generatedMap.forEach((row, rowID) => {
			row.forEach((cell, cellID) => {
				if (cell === 3) {
					enemies.push({ entityType: 'enemy', x: cellID, y: rowID, hp: 40, atk: 12 });
				} else if (cell === 4) {
					weapons.push({ x: cellID, y: rowID });
				} else if (cell === 5) {
					health.push({ x: cellID, y: rowID });
				}
			});
		});
		return {
			enemies,
			weapons,
			health
		};
	}

	checkMove({ xDir, yDir }) {
		const newPosX = this.props.player.x + xDir;
		const newPosY = this.props.player.y + yDir;
		const valueAtPosition = this.getCell({
			x: newPosX,
			y: newPosY,
		});
		if (valueAtPosition === 1) {
			this.props.move(xDir, yDir);
		}
	}

	getCell({ x, y }) {
		if (this.props.board[y]) {
			return this.props.board[y][x];
		}
	}

	calculateAtk(lvl, wpnDmg = 12) {
		let atk = (12 * lvl) + wpnDmg;
		return atk;
	}

	convertBoardToScreen(board, player) {
		// Create a copy of the board to prevent modification of the original.
		let tempBoard = board.map(row => row.slice());
		tempBoard[player.y][player.x] = 2;
		return tempBoard;
	}

	/**
	 * Returns the visible part of the board/level.
	 * @return {Array} The visible part of the level for the screen
	 * component to render.
	 */
	getScreen() {
		let player = this.props.player;
		let screen = this.convertBoardToScreen(this.props.board, player);

		// Sets camera bounding box around player.
		let offset = 25;

		// Object representing the camera bounding box around the
		// player.
		let camera = {
			top: player.y - offset,
			bottom: player.y + offset
		};

		// Keep the camera within the board.
		if (camera.top < 0) {
			camera.top = 0;
			camera.bottom = camera.top + (2 * offset);
		} else if (camera.bottom > screen.length) {
			camera.bottom = screen.length;
			camera.top = camera.bottom - (2 * offset);
		}
		return screen.slice(camera.top, camera.bottom);
	}

	render() {
		let player = this.props.player;
		return (
			<div className='game'>
				<Hud
				hp={player.hp}
				wpn={player.wpn.name}
				atk={this.calculateAtk(player.lvl, player.wpn.atk)}
				lvl={player.lvl}
				xp={player.xp}
				/>
				<Screen
				screen={this.getScreen()}
				/>
			</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		entities: state.entities,
		player: state.player,
		board: state.board
	};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		dealDmg,
		updateBoard,
		move,
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);