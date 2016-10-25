import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions
import {
	setMapLevel,
	setGameOver,
	updateBoard,
	move,
	setPlayerPosition,
	damageEnemy,
	takeDamage,
	healDamage,
	changeWpn,
	setXp,
	gainLevel,
	addWeapon,
	addEnemy,
	removeEnemy,
	addHealth,
} from '../actions';

// components
import Hud from '../components/hud';
import Screen from '../components/screen';

// logic
import level from '../logic/level';
import rng from '../logic/randomNumberGenerator';



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
		roomSize: 12,
		roomCount: 25,
	},
	camera: {
		offset: 25,
	},

	weapons: [
		{
			name: 'dagger',
			atk: 12,
			upgradeLvl: 1,
		},
		{
			name: 'sword',
			atk: 28,
			upgradeLvl: 2,
		},
		{
			name: 'great sword',
			atk: 36,
			upgradeLvl: 3,
		},
		{
			name: 'katana',
			atk: 48,
			upgradeLvl: 4,
		},
		{
			name: 'Molten Dagger',
			atk: 60,
			upgradeLvl: 5,
		},
	],
	baseXpBreakpoint: 40,
};

class Game extends Component {
	componentWillMount() {
		this.props.setMapLevel(1);
		this.startLevel(this.props.gameState.level);
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
			this.props.setMapLevel(1);
			this.startLevel(this.props.gameState.level);
		}
		const move = moves[keyEvent.keyCode];
		if (move) {
			this.checkMove(move);
		}
	}

	startLevel(levelNumber) {
		const maxMainRoomSize = config.map.roomSize * 1.5;
		const randStartX = rng.getRandomInt(1, config.map.width - maxMainRoomSize);
		const randStartY = rng.getRandomInt(1, config.map.height - maxMainRoomSize);
		this.props.setPlayerPosition(randStartX, randStartY);
		const newMap = level.generateRandomMap(randStartX, randStartY, config.map);
		this.getObjectsFromMap(newMap, levelNumber);
		this.props.updateBoard(newMap);
	}

	getObjectsFromMap(generatedMap, levelNumber) {
		generatedMap.forEach((row, rowID) => {
			row.forEach((cell, cellID) => {
				if (cell === 3) {
					this.props.addEnemy({ x: cellID, y: rowID, hp: 40, atk: 12, lvl: levelNumber, });
				} else if (cell === 4) {
					this.props.addWeapon({ x: cellID, y: rowID, lvl: levelNumber, });
				} else if (cell === 5) {
					this.props.addHealth({ x: cellID, y: rowID, lvl: levelNumber, });
				}
			});
		});
	}

	getEnemyAt(x, y) {
		const targetEnemy = this.props.enemies.find(enemy => enemy.x === x && enemy.y === y);
		if (targetEnemy !== undefined) {
			return targetEnemy;
		}
		throw new Error(`getEnemyAt(): Enemy not found at x:${x},y:${y}`);
	}

	attackEnemy(enemy, xDir, yDir) {
		const player = this.props.player;
		const playerAtk = this.calculateAtk(player.lvl, player.wpn.atk);
		const enemyAtk = this.calculateAtk(enemy.lvl);
		this.props.damageEnemy(enemy, playerAtk);
		if (enemy.hp - playerAtk <= 0) {
			this.removeEnemy(enemy, xDir, yDir);
			this.gainXp(enemy.lvl * 20);
		}else {
			this.props.takeDamage(enemyAtk);
			if (this.props.player.hp <= 0) {
				this.props.setGameOver(true);
			}
		}
	}

	removeEnemy(enemy, xDir, yDir) {
		this.props.removeEnemy(enemy.id);
		this.props.move(xDir, yDir);
		let map = this.copyMap(this.props.board);
		map[enemy.y][enemy.x] = 1;
		console.log(enemy.id);
		this.props.updateBoard(map);
	}

	getHealthAt(x, y) {
		const healths = this.props.healths;
		const targetHealth = healths.find(health => health.x === x && health.y === y);
		if (targetHealth !== undefined) {
			return targetHealth;
		}
		throw new Error(`getHealthAt(): Health not found at x:${x},y:${y}`);
	}

	pickupHealth(health, xDir, yDir) {
		const player = this.props.player;
		let healAmount = health.lvl * 40;
		let map = this.copyMap(this.props.board);
		map[health.y][health.x] = 1;
		this.props.updateBoard(map);
		this.props.healDamage(healAmount);
		this.props.move(xDir, yDir);
	}

	getWeaponAt(x, y) {
		const weapons = this.props.weapons;
		const targetWeapon = weapons.find(weapon => weapon.x === x && weapon.y === y);
		if (targetWeapon !== undefined) {
			return targetWeapon;
		}
		throw new Error(`getWeaponAt(): Weapon not found at x:${x},y:${y}`);
	}

	pickupWeapon(weapon, xDir, yDir) {
		const player = this.props.player;
		let map = this.copyMap(this.props.board);
		const currentWpnUpgrade = player.wpn.upgradeLvl;
		map[weapon.y][weapon.x] = 1;
		this.props.updateBoard(map);
		this.props.changeWpn(config.weapons[currentWpnUpgrade]);
		this.props.move(xDir, yDir);
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
			this.attackEnemy(this.getEnemyAt(newPosX, newPosY), xDir, yDir);
		} else if (valueAtPosition === 4) {
			this.pickupWeapon(this.getWeaponAt(newPosX, newPosY), xDir, yDir);
		} else if (valueAtPosition === 5) {
			this.pickupHealth(this.getHealthAt(newPosX, newPosY), xDir, yDir);
		} else if (valueAtPosition === 6) {
			this.props.setMapLevel(this.props.gameState.level + 1);
			this.startLevel(this.props.gameState.level);
		}
	}

	getCell({ x, y }) {
		if (this.props.board[y]) {
			return this.props.board[y][x];
		}
	}

	getXpBreakPoint() {
		const baseBreakpoint = config.baseXpBreakpoint;
		const playerLvl = this.props.player.lvl;
		if (playerLvl === 1) {
			return baseBreakpoint;
		}
		return baseBreakpoint + (baseBreakpoint * (this.props.player.lvl / 5));
	}

	gainXp(amount) {
		// const xpTotal = this.props.player.xp + amount;
		// const breakPoint = this.getXpBreakPoint();
		// let xpToGain = xpTotal;
		// while (xpToGain > this.getXpBreakPoint()) {
		// 	xpToGain -= this.getXpBreakPoint();
		// }
		// this.props.setXp(amount);
		let totalXp = this.props.player.xp + amount;
		let xpBreakPoint = this.getXpBreakPoint();
		if (totalXp >= xpBreakPoint) {
			this.props.gainLevel();
			let newTotal = totalXp - xpBreakPoint;
			this.props.setXp(0);
			this.gainXp(newTotal);
			return true;
		}
		this.props.setXp(totalXp);
		return false;
	}

	randomizeAtk(lvl, wpnDmg) {
		const baseAtk = this.calculateAtk(lvl, wpnDmg);
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
		if (camera.top <= 0) {
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
					maxXp={this.getXpBreakPoint()}
					dungeonLevel={this.props.gameState.level}
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
		gameState: state.gameState,
	};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		setMapLevel,
		setGameOver,
		updateBoard,
		move,
		setPlayerPosition,
		damageEnemy,
		takeDamage,
		healDamage,
		setXp,
		changeWpn,
		gainLevel,
		addWeapon,
		addEnemy,
		removeEnemy,
		addHealth,
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);