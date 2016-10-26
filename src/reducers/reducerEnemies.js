const initialState = [];

const enemy = (state = {}, action) => {
	switch (action.type) {
		case 'ADD_ENEMY':
			return {
				id: action.id,
				x: action.x,
				y: action.y,
				hp: action.hp,
				atk: action.atk,
				lvl: action.lvl,
			};
		case 'REMOVE_ENEMY': {
			return state.id === action.enemy.id ? {} : state;
		}
		case 'DAMAGE_ENEMY': {
			if (state.id !== action.enemy.id) {
				return state;
			}
			return Object.assign({}, state, {
				hp: state.hp - action.amount,
			});
		}
		default:
			return state;
	}
}


const enemies = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_ENEMY':
			return Object.assign([], [
				...state,
				enemy(undefined, action),
			]);
		case 'REMOVE_ENEMY':
			return Object.assign([], state.map(en => enemy(en, action)));
		case 'DAMAGE_ENEMY':
			return Object.assign([], state.map(en => enemy(en, action)));
		case 'RESET_STATE':
			return Object.assign([], initialState);
		case 'ADD_BOSS':
			return Object.assign([], [
				...state,
				action.boss,
				]);
		default:
			return state;
	}
}

export default enemies;