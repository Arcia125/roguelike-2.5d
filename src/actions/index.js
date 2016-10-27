/*
 * action creators
 */

export const takeDamage = amount => {
	return {
		type: 'TAKE_DMG',
		amount,
	};
}

export const setMapLevel = level => ({ type: 'SET_MAP_LEVEL', level });

export const setGameOver = (gameOver, endCondition) => {
	return {
		type: 'SET_GAME_OVER',
		gameOver,
		endCondition,
	};
}

export const pickupHealth = (health, fillValue) => ({ type: 'PICKUP_HEALTH', health, fillValue, });

export const pickupWeapon = (weapon, fillValue) => {
	return { type: 'PICKUP_WEAPON', weapon, fillValue, };
}

export const gainLevel = () => {
	return { type: 'GAIN_LEVEL', amount: 1, };
}

export const setXp = amount => {
	return { type: 'SET_XP', amount, };
}

export const updateBoard = board => ({ type: 'UPDATE_BOARD', board, });

export const updatePosition = (x, y, fillValue) => ({ type: 'UPDATE_POSITION', x, y, fillValue });

export const setPlayerPosition = (oldX, oldY, x, y) => {
	return { type: 'SET_PLAYER_POSITION', oldX, oldY, x, y, };
}

export const damageEnemy = (enemy, amount) => ({ type: 'DAMAGE_ENEMY', enemy, amount, });

let nextWeaponId = 0;
export const addWeapon = weapon => ({ type: 'ADD_WEAPON', id: nextWeaponId++, weapon, });

export const removeAllWeapons = weaponFillValue => ({ type: 'REMOVE_ALL_WEAPONS', fillValue: weaponFillValue, });

let nextEnemyId = 0;
export const addEnemy = ({ x, y, hp, atk, lvl }) => ({ type: 'ADD_ENEMY', id: nextEnemyId++, x, y, hp, atk, lvl, });

export const killEnemy = (enemy, fillValue) => ({ type: 'REMOVE_ENEMY', enemy, fillValue, });

let nextHealthId = 0;
export const addHealth = ({ x, y, healValue, }) => ({ type: 'ADD_HEALTH', id: nextHealthId++, x, y, healValue, });

export const resetState = () => ({ type: 'RESET_STATE', });

export const toggleLights = () => ({ type: 'TOGGLE_LIGHTS', });

export const addBoss = (boss) => {
	const finalBoss = Object.assign(boss, { id: nextEnemyId++ });
	return { type: 'ADD_BOSS', boss: finalBoss, };
}

let nextMsgId = 0;
export const addMsg = (msg, logLevel) => {
	return { type: 'ADD_MSG', msg, id: nextMsgId++, logLevel, };
}

export const removeMsg = msg => {
	return { type: 'REMOVE_MSG', msg, };
}

// export const setWin = didWin => ({ type: 'SET_WIN', didWin, });