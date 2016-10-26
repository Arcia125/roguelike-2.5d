import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions
import {
	setMapLevel,
	setGameOver,
	updateBoard,
	updatePosition,
	setPlayerPosition,
	damageEnemy,
	takeDamage,
	pickupHealth,
	pickupWeapon,
	setXp,
	gainLevel,
	addWeapon,
	removeAllWeapons,
	addEnemy,
	killEnemy,
	addHealth,
	resetState,
	toggleLights,
	addBoss,
} from '../actions';

// components
import Hud from '../components/hud';
import Screen from '../components/screen';

// logic
import level from '../logic/level';
import rng from '../logic/randomNumberGenerator';

// config
import config from './gameConfig';

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
		this.startLevel(1);
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
		if (keyEvent.keyCode === 85) {
			this.startLevel(1);
		}
		if (keyEvent.keyCode === 76) {
			this.props.toggleLights();
		}
		const move = moves[keyEvent.keyCode];
		if (move) {
			this.checkMove(move);
		}
	}

	startLevel(levelNumber) {
		this.props.setMapLevel(levelNumber);
		if (levelNumber === 1) {
			this.props.resetState();
		}
		const player = this.props.player;
		const maxMainRoomSize = config.map.roomSize * 1.5;
		const randStartX = rng.getRandomInt(1, config.map.width - maxMainRoomSize);
		const randStartY = rng.getRandomInt(1, config.map.height - maxMainRoomSize);
		const newMap = level.generateRandomMap(randStartX, randStartY, config.map);
		this.getObjectsFromMap(newMap, levelNumber);
		this.props.updateBoard(newMap);
		this.props.setPlayerPosition(player.x, player.y, randStartX, randStartY);
	}

	getObjectsFromMap(generatedMap, levelNumber) {
		generatedMap.forEach((row, rowID) => {
			row.forEach((cell, cellID, arr) => {
				if (cell === config.fillValues.enemy) {
					this.props.addEnemy({ x: cellID, y: rowID, hp: 40, atk: 12, lvl: levelNumber, });
				} else if (cell === config.fillValues.weapon) {
					this.props.addWeapon(Object.assign({ x: cellID, y: rowID, }, config.weapons[levelNumber]));
				} else if (cell === config.fillValues.health) {
					this.props.addHealth({ x: cellID, y: rowID, healValue: 40 + (levelNumber * 10), });
				} else if (cell === config.fillValues.exit && levelNumber >= config.finalLevel) {
					arr[cellID] = 7;
					this.props.addBoss(Object.assign({}, config.boss, { x: cellID, y: rowID, lvl: levelNumber, }));
					console.log(this.props.enemies);
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
		const playerAtk = this.randomizeAtk(player.lvl, player.wpn.atk);
		const enemyAtk = this.randomizeAtk(enemy.lvl);
		this.props.damageEnemy(enemy, playerAtk);
		if (enemy.hp - playerAtk <= 0) {
			this.killEnemy(enemy, xDir, yDir);
			this.gainXp(enemy.lvl * 20);
			if (enemy.name === "BOSS") {
				this.props.setGameOver(true);
			}
		}else {
			this.props.takeDamage(enemyAtk);
			if (this.props.player.hp <= 0) {
				this.props.setGameOver(true);
			}
		}
	}

	killEnemy(enemy) {
		const player = this.props.player;
		this.props.killEnemy(enemy, config.fillValues.floor);
		this.props.setPlayerPosition(player.x, player.y, enemy.x, enemy.y);
	}

	getHealthAt(x, y) {
		const healths = this.props.healths;
		const targetHealth = healths.find(health => health.x === x && health.y === y);
		if (targetHealth !== undefined) {
			return targetHealth;
		}
		throw new Error(`getHealthAt(): Health not found at x:${x},y:${y}`);
	}

	receiveHealthPack(health) {
		const player = this.props.player;
		this.props.pickupHealth(health, config.fillValues.floor);
		this.props.setPlayerPosition(player.x, player.y, health.x, health.y);
	}

	getWeaponAt(x, y) {
		const targetWeapon = this.props.weapons.find(weapon => weapon.x === x && weapon.y === y);
		if (targetWeapon !== undefined) {
			return targetWeapon;
		}
		throw new Error(`getWeaponAt(): Weapon not found at x:${x},y:${y}`);
	}

	pickupWeaponExlclusive(weapon) {
		// Only allows one weapon per level to be picked up.
		const player = this.props.player;
		this.props.pickupWeapon(weapon, config.fillValues.floor);
		this.props.removeAllWeapons(config.fillValues.weapon);
		this.props.setPlayerPosition(player.x, player.y, weapon.x, weapon.y);
	}

	checkMove({ xDir, yDir }) {
		const player = this.props.player;
		const newPosX = player.x + xDir;
		const newPosY = player.y + yDir;
		const valueAtPosition = this.getCell({
			x: newPosX,
			y: newPosY,
		});
		if (valueAtPosition === 1) {
			this.props.setPlayerPosition(player.x, player.y, newPosX, newPosY);
		} else if (valueAtPosition === config.fillValues.enemy) {
			this.attackEnemy(this.getEnemyAt(newPosX, newPosY));
		} else if (valueAtPosition === config.fillValues.weapon) {
			this.pickupWeaponExlclusive(this.getWeaponAt(newPosX, newPosY));
		} else if (valueAtPosition === config.fillValues.health) {
			this.receiveHealthPack(this.getHealthAt(newPosX, newPosY));
		} else if (valueAtPosition === config.fillValues.exit) {
			this.startLevel(this.props.gameState.level + 1);
		} else if (valueAtPosition === config.fillValues.boss) {
			this.attackEnemy(this.getEnemyAt(newPosX, newPosY));
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
		const maxAtk = baseAtk * 1.5;
		const minAtk = baseAtk * 0.5;
		return rng.getRandomInt(minAtk, maxAtk);
	}

	calculateAtk(lvl, wpnDmg = 12) {
		const atk = (12 * lvl) + wpnDmg;
		return atk;
	}

	copyMap(board) {
		return board.map(row => row.slice());
	}

	applyDarkness(map) {
		const player = this.props.player;
		return map.map((row, rowID) => row.map((cell, cellID) => {
			const maskRadius = config.camera.maskRadius;
			const distX = Math.abs(player.x - cellID);
			const distY = Math.abs(player.y - rowID);
			return distX + distY > maskRadius ? config.fillValues.darkness : cell;
		}));
	}

	/**
	 * Returns the visible part of the board/level.
	 * @return {Array} The visible part of the level for the screen
	 * component to render.
	 */
	getScreen() {
		if (this.props.gameState.gameOver) {
			console.log('GAME OVER');
		}
		const player = this.props.player;
		let map = this.copyMap(this.props.board);

		// Object representing the camera bounding box around the player.
		let camera = {
			top: player.y - config.camera.offset,
			bottom: player.y + config.camera.offset,
		};

		// Keep the camera within the board.
		if (camera.top <= 0) {
			camera.top = 0;
			camera.bottom = camera.top + (2 * config.camera.offset);
		} else if (camera.bottom > map.length) {
			camera.bottom = map.length;
			camera.top = camera.bottom - (2 * config.camera.offset);
		}
		if (!this.props.gameState.lights) {
			map = this.applyDarkness(map);
		}
		return map.slice(camera.top, camera.bottom);
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
					fillValues={config.classes}
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
		updatePosition,
		setPlayerPosition,
		damageEnemy,
		takeDamage,
		pickupHealth,
		setXp,
		pickupWeapon,
		gainLevel,
		addWeapon,
		removeAllWeapons,
		addEnemy,
		killEnemy,
		addHealth,
		resetState,
		toggleLights,
		addBoss,
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);