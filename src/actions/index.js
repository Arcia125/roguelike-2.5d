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

export const healDamage = amount => ({ type: 'HEAL_DMG', amount, });

export const changeWpn = ({ atk, name, upgradeLvl }) => {
	console.log(`You picked up the weapon ${name}!`);
	return { type: 'CHANGE_WPN', atk, name, upgradeLvl, };
}

export const gainLevel = () => {
	console.log(`You gained a level!`);
	return { type: 'GAIN_LEVEL', amount: 1, };
}

export const setXp = amount => {
	return { type: 'SET_XP', amount, };
}

export const updateBoard = board => ({ type: 'UPDATE_BOARD', board, });

export const move = (xChange, yChange) => ({ type: 'MOVE', xChange, yChange, });

export const setPlayerPosition = (x, y) => {
	return { type: 'SET_PLAYER_POSITION', x, y };
}

export const damageEnemy = (enemy, amount) => ({ type: 'DAMAGE_ENEMY', enemy, amount, });

let nextWeaponId = 0;
export const addWeapon = ({ x, y, lvl }) => ({ type: 'ADD_WEAPON', id: nextWeaponId++, x, y, lvl,  });

let nextEnemyId = 0;
export const addEnemy = ({ x, y, hp, atk, lvl }) => ({ type: 'ADD_ENEMY', id: nextEnemyId++, x, y, hp, atk, lvl, });

export const removeEnemy = id => ({ type: 'REMOVE_ENEMY', id });

let nextHealthId = 0;
export const addHealth = ({ x, y, lvl, }) => ({ type: 'ADD_HEALTH', id: nextHealthId++, x, y, lvl, });

