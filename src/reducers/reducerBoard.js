const initialBoard = [];

export default (state = initialBoard, action) => {
	switch (action.type) {
		case 'UPDATE_BOARD':
			return Object.assign({}, action.board);
			break;
	}
	return state;
}