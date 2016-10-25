const health = (state = {}, action) => {
	switch (action.type) {
		case 'ADD_HEALTH':
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


const healths = (state = [], action) => {
	switch (action.type) {
		case 'ADD_HEALTH':
		return [
			...state,
			health(undefined, action),
		];
	}
	return state;
}

export default healths;