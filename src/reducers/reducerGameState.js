const initialGameState = {
	level: 1,
	gameOver: false,
	lights: false,
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
			});
		case 'RESET_STATE':
			return Object.assign({}, initialGameState);
		default:
			return state;
	}
}

export default gameState;