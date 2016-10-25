/*
 * action creators
 */
export const dealDmg = (target, amount) => {
	console.log(`${amount} damage was dealt to ${target}!`);
	return {
		type: 'DEAL_DMG',
		target,
		amount,
	};
}

export const takeDamage = amount => {
	console.log(`Player sustained ${amount} damage!`);
	return {
		type: 'TAKE_DMG',
		amount,
	};
}

export const setMapLevel = level => ({ type: 'SET_MAP_LEVEL', level });

export const setGameOver = gameOver => {
	return {
		type: 'SET_GAME_OVER',
		gameOver,
	};
}

export const pickupHealth = (health, fillValue) => ({ type: 'PICKUP_HEALTH', health, fillValue, });

export const pickupWeapon = (weapon, fillValue) => {
	console.log(`You picked up the weapon ${weapon.name}!`);
	return { type: 'PICKUP_WEAPON', weapon, fillValue };
}

export const gainLevel = () => {
	console.log(`You gained a level!`);
	return { type: 'GAIN_LEVEL', amount: 1, };
}

export const setXp = amount => {
	return { type: 'SET_XP', amount, };
}

export const updateBoard = board => ({ type: 'UPDATE_BOARD', board, });

export const updatePosition = (x, y, fillValue) => ({ type: 'UPDATE_POSITION', x, y, fillValue });

export const move = (x, y) => ({ type: 'MOVE', x, y, });

export const setPlayerPosition = (oldX, oldY, x, y) => {
	return { type: 'SET_PLAYER_POSITION', oldX, oldY, x, y, };
}

export const damageEnemy = (enemy, amount) => ({ type: 'DAMAGE_ENEMY', enemy, amount, });

let nextWeaponId = 0;
export const addWeapon = weapon => ({ type: 'ADD_WEAPON', id: nextWeaponId++, weapon, });

export const removeAllWeapons = weaponFillValue => ({ type: 'REMOVE_ALL_WEAPONS', fillValue: weaponFillValue, });

let nextEnemyId = 0;
export const addEnemy = ({ x, y, hp, atk, lvl }) => ({ type: 'ADD_ENEMY', id: nextEnemyId++, x, y, hp, atk, lvl, });

export const killEnemy = (enemy, fillValue) => ({ type: 'REMOVE_ENEMY', enemy, fillValue });

let nextHealthId = 0;
export const addHealth = ({ x, y, lvl, }) => ({ type: 'ADD_HEALTH', id: nextHealthId++, x, y, lvl, });

export const resetState = () => ({ type: 'RESET_STATE', });