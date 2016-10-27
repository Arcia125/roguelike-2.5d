const initialState = [];

const message = (state = {}, action) => {
	switch (action.type) {
		case 'ADD_MSG':
			return {
				id: action.id,
				msg: action.msg,
				logLevel: action.logLevel,
			};
		case 'REMOVE_MSG': {
			return state.id === action.message.id ? {} : state;
		}
		default:
			return state;
	}
}


const log = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_MSG':
			return Object.assign([], [
				...state,
				message(undefined, action),
			]);
		case 'REMOVE_MSG':
			return Object.assign([], state.map(msg => message(msg, action)));
		case 'RESET_STATE':
			return Object.assign([], initialState);
		default:
			return state;
	}
}

export default log;