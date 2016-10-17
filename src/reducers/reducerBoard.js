import {
	createEmptyMap,
	makeRoom,
	insertRoom
} from '../logic/level';

const initialBoard = insertRoom(createEmptyMap(), makeRoom(10, 15, 2, 2));

export default (state = initialBoard, action) => {
	switch (action.type) {
		case 'UPDATE_BOARD':
			return action.board;
			break;
	}
	return state;
}