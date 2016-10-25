let initialPlayer = {
	id: 1,
	hp: 100,
	wpn: { name: 'dagger', atk: 12, },
	lvl: 1,
	xp: 0,
	x: 0,
	y: 0,
};

export default (state = initialPlayer, action) => {
	switch (action.type) {
		case 'TAKE_DMG':
			return Object.assign({}, state, {
				hp: state.hp - action.amount,
			});
		case 'PICKUP_HEALTH':
			return Object.assign({}, state, {
				hp: state.hp + action.health.healValue,
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
		case 'PICKUP_WEAPON':
			return Object.assign({}, state, {
				wpn: {
					name: action.weapon.name,
					atk: action.weapon.atk,
				},
			});
		case 'RESET_STATE':
			return Object.assign({}, initialPlayer);
		default:
			return state;

	}
}