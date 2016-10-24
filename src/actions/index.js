/*
 * action creators
 */
export const dealDmg = (target, amount) => {
	console.log(`${amount} damage was dealt to ${target}`);
	return {
		type: 'DEAL_DMG',
		target,
		amount,
	};
}

export const takeDmg = (amount) => {
	console.log(`Player sustained ${amount} damage`);
	return {
		type: 'TAKE_DMG',
		amount,
	};
}

export const healDmg = amount => ({ type: 'HEAL_DMG', amount, });

export const changeWpn = weapon => ({ type: 'CHANGE_WPN', weapon, });

export const incLevel = amount => ({ type: 'INC_LEVEL', amount, });

export const addXP = amount => ({ type: 'ADD_XP', amount, });

export const updateBoard = board => ({ type: 'UPDATE_BOARD', board, });

export const move = (xChange, yChange) => ({ type: 'MOVE', xChange, yChange, });

export const damageEnemy = (enemy, amount) => ({ type: 'DAMAGE_ENEMY', enemy, amount, });

let nextWeaponId = 0;
export const addWeapon = ({ x, y, }) => ({ type: 'ADD_WEAPON', id: nextWeaponId++, x, y, });

let nextEnemyId = 0;
export const addEnemy = ({ x, y, hp, atk, }) => ({ type: 'ADD_ENEMY', id: nextEnemyId++, x, y, hp, atk, });

let nextHealthId = 0;
export const addHealth = ({ x, y, }) => ({ type: 'ADD_HEALTH', id: nextHealthId++, x, y, })
