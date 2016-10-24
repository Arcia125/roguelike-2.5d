const enemy = (state = {}, action) => {
	switch (action.type) {
		case 'ADD_ENEMY':
			return {
				id: action.id,
				x: action.x,
				y: action.y,
				hp: action.hp,
				atk: action.atk,
			};
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


const enemies = (state = [], action) => {
	switch (action.type) {
		case 'ADD_ENEMY':
		return [
			...state,
			enemy(undefined, action),
		];
		case 'DAMAGE_ENEMY':
			return state.map(en => enemy(en, action));
	}
	return state;
}

export default enemies;