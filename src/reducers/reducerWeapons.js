const weapon = (state = {}, action) => {
	switch (action.type) {
		case 'ADD_WEAPON':
			return {
				id: action.id,
				x: action.x,
				y: action.y,
				lvl: action.lvl,
			};
		default:
			return state;
	}
}


const weapons = (state = [], action) => {
	switch (action.type) {
		case 'ADD_WEAPON':
		return [
			...state,
			weapon(undefined, action),
		];
	}
	return state;
}

export default weapons;