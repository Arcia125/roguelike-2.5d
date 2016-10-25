import level from '../logic/level';
const initialBoard = level.createEmptyMap();

const updatePosition = (state, x, y, fillValue) => {
	if (state[y][x] === fillValue) {
		return state;
	}
	return [
		...state.slice(0, y),
		[
		...state[y].slice(0, x),
		fillValue,
		...state[y].slice(x + 1),
		],
		...state.slice(y + 1),
		];
}

const removeByFillValue = (state, fillValue) => {
	return state.map(row => row.map(col => col === 4 ? 1 : col));
}

const board = (state = initialBoard, action) => {
	switch (action.type) {
		case 'UPDATE_BOARD':
			return Object.assign([], action.board);
		case 'UPDATE_POSITION':
			return Object.assign([], updatePosition(state, action.x, action.y, action.fillValue));
		case 'REMOVE_ENEMY':
			return Object.assign([], updatePosition(state, action.enemy.x, action.enemy.y, action.fillValue));
		case 'PICKUP_WEAPON':
			return Object.assign([], updatePosition(state, action.weapon.x, action.weapon.y, action.fillValue));
		case 'REMOVE_ALL_WEAPONS':
			return Object.assign([], removeByFillValue(state, action.fillValue));
		case 'PICKUP_HEALTH':
			return Object.assign([], updatePosition(state, action.health.x, action.health.y, action.fillValue));
		case 'RESET_STATE':
			return Object.assign([], initialBoard);
		case 'SET_PLAYER_POSITION': {
			let newState = updatePosition(state, action.x, action.y, 2);
			if (newState[action.oldY][action.oldX] !== 0) {
				newState[action.oldY][action.oldX] = 1
			}
			return Object.assign([], newState);
		}
		default:
			return state;
	}
}

export default board;