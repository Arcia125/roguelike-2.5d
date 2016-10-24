/*
 * action creators
 */
export const dealDmg = (target, amount) => {
	console.log(`${amount} damage was dealt to ${target}`);
	return {
		type: 'DEAL_DMG',
		target,
		amount
	};
}

export const takeDmg = (amount) => {
	console.log(`Player sustained ${amount} damage`);
	return {
		type: 'TAKE_DMG',
		amount
	};
}

export const healDmg = amount => ({ type: 'HEAL_DMG', amount });

export const changeWpn = weapon => ({ type: 'CHANGE_WPN', weapon });

export const incLevel = amount => ({ type: 'INC_LEVEL', amount });

export const decLevel = amount => ({ type: 'DEC_LEVEL', amount });

export const addXP = amount => ({ type: 'ADD_XP', amount });

export const updateBoard = board => ({ type: 'UPDATE_BOARD', board });

export const move = (xChange, yChange) => ({ type: 'MOVE', xChange, yChange });

export const addEntities = entities => ({ type: 'ADD_ENTITIES', entities });