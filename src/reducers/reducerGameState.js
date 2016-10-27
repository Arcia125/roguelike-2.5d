const initialGameState = {
	level: 1,
	gameOver: false,
	lights: false,
	endCondition: '',
};

const gameState = (state = initialGameState, action) => {
	switch(action.type) {
		case 'SET_MAP_LEVEL':
			return Object.assign({}, state, { level: action.level });
		case 'TOGGLE_LIGHTS':
			return Object.assign({}, state, { lights: !state.lights });
		case 'SET_GAME_OVER':
			return Object.assign({}, state, {
				gameOver: action.gameOver,
				endCondition: action.endCondition,
			});
		case 'RESET_STATE':
			return Object.assign({}, initialGameState);
		default:
			return state;
	}
}

export default gameState;