import { combineReducers } from 'redux';

import PlayerReducer from './reducerPlayer';
import BoardReducer from './reducerBoard';

const allReducers = combineReducers({
	player: PlayerReducer,
	board: BoardReducer,
});

export default allReducers;