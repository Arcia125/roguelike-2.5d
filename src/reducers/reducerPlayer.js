const initialPlayer = {
	id: 1,
	hp: 100,
	wpn: { name: 'dagger', atk: 12 },
	lvl: 1,
	xp: 0,
	x: 30,
	y: 40,
};

export default (state = initialPlayer, action) => {
	switch (action.type) {
		case 'TAKE_DMG':
			return Object.assign({}, state, {
				hp: state.hp - action.amount,
			});
		case 'MOVE':
			return Object.assign({}, state, {
				x: state.x + action.xChange,
				y: state.y + action.yChange
			});
		default:
			return state;

	}
}