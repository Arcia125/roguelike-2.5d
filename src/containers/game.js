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
	addMsg,
	removeMsg,
} from '../actions';

// components
import Hud from '../components/hud';
import Screen from '../components/screen';
import CombatLog from '../components/combatLog';

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

const logLevel = {
	info: 'info',
	warn: 'warn',
	danger: 'danger',
	heal: 'heal',
};

class Game extends Component {
	componentWillMount() {
		window.addEventListener('keydown', this.debounce(this.handleKeys.bind(this), 1), true);
		this.startLevel(1);
		this.log('Greetings hero. Your mission is to reach the 4th level of this dungeon and slay the dungeon boss. First you should gain some experience fighting his minions. Be on the lookout for weapons to increase your fighting power. Good luck hero.', logLevel.info);
	}

	debounce(func, delay) {
		let timer = null;
		return function(...args) {
			const context = this;
			clearTimeout(timer);
			timer = setTimeout(function debounced() {
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
		} else {
			this.log(`You have reached stage ${levelNumber}.`, logLevel.info);
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
					this.props.addEnemy({ x: cellID, y: rowID, hp: 40 + (30 * levelNumber) , atk: this.calculateAtk(levelNumber, 30), lvl: levelNumber, });
				} else if (cell === config.fillValues.weapon) {
					this.props.addWeapon(Object.assign({ x: cellID, y: rowID, }, config.weapons[levelNumber]));
				} else if (cell === config.fillValues.health) {
					this.props.addHealth({ x: cellID, y: rowID, healValue: 40 + (levelNumber * 15), });
				} else if (cell === config.fillValues.exit && levelNumber >= config.finalLevel) {
					arr[cellID] = 7;
					this.props.addBoss(Object.assign({}, config.boss, { x: cellID, y: rowID, lvl: levelNumber, }));
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
		if (this.props.gameState.gameOver) {
			return false;
		}
		const player = this.props.player;
		const playerAtk = this.randomizeAtk(player.lvl, player.wpn.atk);
		const enemyAtk = this.randomizeAtk(enemy.lvl);
		this.props.damageEnemy(enemy, playerAtk);
		this.log(`You attacked a level ${enemy.lvl} enemy dealing ${playerAtk} damage.`, logLevel.warn);
		if (enemy.hp - playerAtk <= 0) {
			this.killEnemy(enemy, xDir, yDir);
			if (enemy.name === "BOSS") {
				this.props.setGameOver(true, 'win');
				return true;
			}
			let xpGain = enemy.lvl * 20;
			this.log(`You gained ${xpGain}xp.`, logLevel.info);
			this.gainXp(xpGain);
		}else {
			this.props.takeDamage(enemyAtk);
			if (this.props.player.hp <= 0) {
				this.log('You died.', logLevel.warn);
				this.props.setGameOver(true, 'lose');
			} else {
				this.log(`You were attacked by a level ${enemy.lvl} enemy for ${enemyAtk} damage.`, logLevel.danger)
			}
		}
	}

	killEnemy(enemy) {
		const player = this.props.player;
		this.props.killEnemy(enemy, config.fillValues.floor);
		this.log(`You killed a level ${enemy.lvl} enemy!`, logLevel.info);
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
		this.log(`Healed for ${health.healValue}`, logLevel.heal);
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
		this.log(`You picked up a ${weapon.name}`, logLevel.info);
		this.props.removeAllWeapons(config.fillValues.weapon);
		this.props.setPlayerPosition(player.x, player.y, weapon.x, weapon.y);
	}

	log(msg, logLevel) {
		this.props.addMsg(msg, logLevel);
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
		const totalXp = this.props.player.xp + amount;
		const xpBreakPoint = this.getXpBreakPoint();
		if (totalXp >= xpBreakPoint) {
			this.props.gainLevel();
			this.log(`Level up! You gained a level. You are now level ${this.props.player.lvl}.`, logLevel.warn);
			const newTotal = totalXp - xpBreakPoint;
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
			if (Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)) >= maskRadius) {
				return config.fillValues.darkness;
			}
			return cell;
		}));
	}

	/**
	 * Returns the visible part of the board/level.
	 * @return {Array} The visible part of the level for the screen
	 * component to render.
	 */
	getScreen() {
		const player = this.props.player;
		let map = this.copyMap(this.props.board);

		// Object representing the camera bounding box around the player.
		const cameraOffset = config.camera.offset;
		let camera = {
			top: player.y - cameraOffset,
			bottom: player.y + cameraOffset,
			left: player.x - cameraOffset,
			right: player.x + cameraOffset,
		};

		// Keep the camera within the board.
		let cameraTop = camera.top;
		let cameraBottom = camera.bottom;
		let cameraLeft = camera.left;
		let cameraRight = camera.right;
		const mapHeight = map.length;
		const mapWidth = map[0].length;
		if (cameraTop <= 0) {
			cameraTop = 0;
			cameraBottom = cameraTop + (2 * cameraOffset);
		} else if (cameraBottom > mapHeight) {
			cameraBottom = mapHeight;
			cameraTop = cameraBottom - (2 * cameraOffset);
		}
		if (cameraLeft <= 0) {
			cameraLeft = 0;
			cameraRight = cameraLeft + (2 * cameraOffset);
		} else if (cameraRight > mapWidth) {
			cameraRight = mapWidth;
			cameraLeft = cameraRight - (2 * cameraOffset);
		}
		if (!this.props.gameState.lights) {
			map = this.applyDarkness(map);
		}
		return map.slice(cameraTop, cameraBottom).map(row => row.slice(cameraLeft, cameraRight));
	}

	render() {
		const player = this.props.player;
		return (
			<div className='game'>
				<div className='title-container'>
					<h1 className='game-title'>
						React Roguelike Dungeon
					</h1>
				</div>
				<Hud
					hp={player.hp}
					wpn={player.wpn.name}
					atk={this.calculateAtk(player.lvl, player.wpn.atk)}
					lvl={player.lvl}
					xp={player.xp}
					maxXp={this.getXpBreakPoint()}
					dungeonLevel={this.props.gameState.level}
				/>
				<div className='legend-container'>
					<span className='legend'>
						<div className='legend-item'>
							<span className='screen-cell wall'/>
							<span className='legend-item-text'> Wall</span>
						</div>
						<div className='legend-item'>
							<span className='screen-cell floor'/>
							<span className='legend-item-text'> Floor</span>
						</div>
						<div className='legend-item'>
							<span className='screen-cell player'/>
							<span className='legend-item-text'> Player</span>
						</div>
						<div className='legend-item'>
							<span className='screen-cell enemy'/>
							<span className='legend-item-text'> Enemy</span>
						</div>
						<div className='legend-item'>
							<span className='screen-cell weapon'/>
							<span className='legend-item-text'> Weapon</span>
						</div>
						<div className='legend-item'>
							<span className='screen-cell health'/>
							<span className='legend-item-text'> Health</span>
						</div>
						<div className='legend-item'>
							<span className='screen-cell exit'/>
							<span className='legend-item-text'> Exit</span>
						</div>
						<div className='legend-item'>
							<span className='screen-cell boss'/>
							<span className='legend-item-text'> Boss</span>
						</div>
					</span>
				</div>
				{!this.props.gameState.gameOver ?
				<Screen
					screen={this.getScreen()}
					fillValues={config.classes}
				/>
				:
				<div className='menu'>
					<h1 className='game-over-header'>{this.props.gameState.endCondition === 'win' ? 'You Win' : 'Game Over'}</h1>
					<button onClick={() => this.startLevel(1)} className='menu-button'>New Game</button>
				</div>}
				<CombatLog/>
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
		addMsg,
		removeMsg,
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);