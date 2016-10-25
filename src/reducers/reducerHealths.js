const initialState = [];

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


const healths = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_HEALTH':
		return Object.assign([], [
			...state,
			health(undefined, action),
		]);
		case 'RESET_STATE':
			return Object.assign([], initialState);
		default:
			return state;
	}
}

export default healths;