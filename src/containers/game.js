import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions
import {
	dealDmg,
	updateBoard,
	move,
	addEntities,
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
		}
		const move = moves[keyEvent.keyCode];
		if (move) {
			this.checkMove(move);
		}
	}


	startLevel() {
		let newMap = generateRandomMap();
		const entities = this.getObjectsFromMap(newMap);
		this.props.addEntities(entities);
		this.props.updateBoard(newMap);
	}

	getObjectsFromMap(generatedMap) {
		let enemies = [];
		let weapons = [];
		let health = [];
		let enemyID = 0;
		let weaponID = 0;
		let healthID = 0;
		generatedMap.forEach((row, rowID) => {
			row.forEach((cell, cellID) => {
				if (cell === 3) {
					enemies.push({ entityType: 'enemy', id: enemyID, x: cellID, y: rowID, hp: 40, atk: 12 });
					enemyID += 1;
				} else if (cell === 4) {
					weapons.push({ entityType: 'weapon', id: weaponID, x: cellID, y: rowID });
					weaponID += 1;
				} else if (cell === 5) {
					health.push({ entityType: 'health', id: healthID, x: cellID, y: rowID });
					healthID += 1;

				}
			});
		});
		return {
			enemies,
			weapons,
			health
		};
	}

	getEnemyAt(x, y) {
		const enemies = this.props.entities.enemies;
		const targetEnemy = enemies.find(enemy => enemy.x === x && enemy.y === y);
		if (targetEnemy !== undefined) {
			return targetEnemy
		}
		throw new Error(`getEnemyAt(): Enemy not found at x:${x},y:${y}`);
	}

	attackEnemy(enemy) {
		const player = this.props.player;
		console.log(enemy);

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
		addEntities,
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);