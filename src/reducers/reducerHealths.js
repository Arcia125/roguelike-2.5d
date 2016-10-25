const initialState = [];

const health = (state = {}, action) => {
	switch (action.type) {
		case 'ADD_HEALTH':
			return {
				id: action.id,
				x: action.x,
				y: action.y,
				healValue: action.healValue,
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
		case 'PICKUP_HEALTH':
			return Object.assign([], state.filter(h => h.id !== action.health.id));
		case 'RESET_STATE':
			return Object.assign([], initialState);
		default:
			return state;
	}
}

export default healths;