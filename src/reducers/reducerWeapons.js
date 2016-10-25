const initialState = [];

const weapon = (state = {}, action) => {
	switch (action.type) {
		case 'ADD_WEAPON':
			return Object.assign({ id: action.id }, action.weapon)
		default:
			return state;
	}
}


const weapons = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_WEAPON':
			return Object.assign([], [
				...state,
				weapon(undefined, action),
			]);
		case 'PICKUP_WEAPON':
			return Object.assign([], state.filter(w => w.id !== action.weapon.id));
		case 'REMOVE_ALL_WEAPONS':
			return Object.assign([], []);
		case 'RESET_STATE':
			return Object.assign([], initialState);
		default:
			return state;
	}
}

export default weapons;