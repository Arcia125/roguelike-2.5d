import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions
import {
	dealDmg,
	updateBoard,
	move,
	damageEnemy,
	addWeapon,
	addEnemy,
	addHealth,
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

const config = {
	map: {
		height: 80,
		width: 60,
		roomSize: 10,
		roomCount: 30,
	},
	camera: {
		offset: 25,
	},
};

class Game extends Component {
	componentWillMount() {
		this.startLevel();
		window.addEventListener('keydown', this.debounce(this.handleKeys.bind(this), 1), true);
	}

	debounce(func, delay) {
		let timer = null;
		return function(...args) {
			const context = this;
			clearTimeout(timer);
			timer = setTimeout(function() {
				func.apply(context, args);
			}, delay);
		};
	}

	handleKeys(keyEvent) {
		if (keyEvent.keyCode == 85) {
			this.props.updateBoard(generateRandomMap());
		}
		const move = moves[keyEvent.keyCode];
		if (move) {
			this.checkMove(move);
		}
	}

	startLevel() {
		const newMap = generateRandomMap(config.map);
		this.getObjectsFromMap(newMap);
		this.props.updateBoard(newMap);
	}

	getObjectsFromMap(generatedMap) {
		generatedMap.forEach((row, rowID) => {
			row.forEach((cell, cellID) => {
				if (cell === 3) {
					this.props.addEnemy({ x: cellID, y: rowID, hp: 40, atk: 12, });
				} else if (cell === 4) {
					this.props.addWeapon({ x: cellID, y: rowID, });
				} else if (cell === 5) {
					this.props.addHealth({ x: cellID, y: rowID, });
				}
			});
		});
	}

	getEnemyAt(x, y) {
		const enemies = this.props.enemies;
		const targetEnemy = enemies.find(enemy => enemy.x === x && enemy.y === y);
		if (targetEnemy !== undefined) {
			return targetEnemy;
		}
		throw new Error(`getEnemyAt(): Enemy not found at x:${x},y:${y}`);
	}

	attackEnemy(enemy) {
		const player = this.props.player;
		const playerAtk = this.calculateAtk(player.lvl, player.wpn.atk);
		console.log(enemy);
		console.log(playerAtk);
		this.props.damageEnemy(enemy, playerAtk);
		if (enemy.hp - playerAtk < 0) {
			console.log('The enemy is dead');
		}
		console.log(enemy);

	}

	removeEnemy(enemy) {

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
		} else if (valueAtPosition === 3) {
			this.attackEnemy(this.getEnemyAt(newPosX, newPosY));
		} else if (valueAtPosition === 4) {
			console.log('picked up a weapon');
		} else if (valueAtPosition === 5) {
			console.log('picked up health');
		}
	}

	getCell({ x, y }) {
		if (this.props.board[y]) {
			return this.props.board[y][x];
		}
	}

	calculateAtk(lvl, wpnDmg = 12) {
		const atk = (12 * lvl) + wpnDmg;
		return atk;
	}

	copyMap(board) {
		return board.map(row => row.slice());
	}

	convertBoardToScreen(board, player) {
		// Create a copy of the board to prevent modification of the original.
		let tempBoard = this.copyMap(board);
		tempBoard[player.y][player.x] = 2;
		return tempBoard;
	}

	/**
	 * Returns the visible part of the board/level.
	 * @return {Array} The visible part of the level for the screen
	 * component to render.
	 */
	getScreen() {
		const player = this.props.player;
		const screen = this.convertBoardToScreen(this.props.board, player);

		// Object representing the camera bounding box around the
		// player.
		let camera = {
			top: player.y - config.camera.offset,
			bottom: player.y + config.camera.offset, 
		};

		// Keep the camera within the board.
		if (camera.top < 0) {
			camera.top = 0;
			camera.bottom = camera.top + (2 * config.camera.offset);
		} else if (camera.bottom > screen.length) {
			camera.bottom = screen.length;
			camera.top = camera.bottom - (2 * config.camera.offset);
		}
		return screen.slice(camera.top, camera.bottom);
	}

	render() {
		const player = this.props.player;
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
		player: state.player,
		board: state.board,
		weapons: state.weapons,
		enemies: state.enemies,
		healths: state.healths,
	};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		dealDmg,
		updateBoard,
		move,
		damageEnemy,
		addWeapon,
		addEnemy,
		addHealth,
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);