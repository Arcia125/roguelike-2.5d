const initialGameState = {
	level: 1,
	gameOver: false,
};

const gameState = (state = initialGameState, action) => {
	switch(action.type) {
		case 'SET_MAP_LEVEL':
			return Object.assign({}, state, {
				level: action.level,
			});
		case 'SET_GAME_OVER':
			return Object.assign({}, state, {
				gameOver: action.gameOver,
			});
		default:
			return state;
	}
}

export default gameState;