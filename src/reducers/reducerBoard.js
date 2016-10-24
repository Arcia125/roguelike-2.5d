import { createEmptyMap } from '../logic/level';
const initialBoard = createEmptyMap();

const boardRow = (state = [], action) => {
	switch (action.type) {
		case 'UPDATE_CELL':
			return state;
		default:
			return state;
	}
}

const board = (state = initialBoard, action) => {
	switch (action.type) {
		case 'UPDATE_BOARD':
			return Object.assign([], action.board);
		default:
			return state;
	}
}

export default board;