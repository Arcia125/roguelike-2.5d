let initialPlayer = {
	id: 1,
	hp: 100,
	wpn: { name: 'dagger', atk: 12, upgradeLvl: 1, },
	lvl: 1,
	xp: 0,
	x: 24,
	y: 34,
};

export default (state = initialPlayer, action) => {
	switch (action.type) {
		case 'TAKE_DMG':
			return Object.assign({}, state, {
				hp: state.hp - action.amount,
			});
		case 'HEAL_DMG':
			return Object.assign({}, state, {
				hp: state.hp + action.amount,
			});
		case 'SET_PLAYER_POSITION':
			return Object.assign({}, state, {
				x: action.x,
				y: action.y,
			});
		case 'MOVE':
			return Object.assign({}, state, {
				x: state.x + action.xChange,
				y: state.y + action.yChange
			});
		case 'SET_XP':
			return Object.assign({}, state, {
				xp: action.amount,
			});
		case 'GAIN_LEVEL':
			return Object.assign({}, state, {
				lvl: state.lvl + action.amount,
			});
		case 'CHANGE_WPN':
			return Object.assign({}, state, {
				wpn: {
					name: action.name,
					atk: action.atk,
					upgradeLvl: action.upgradeLvl,
				},
			});
		default:
			return state;

	}
}