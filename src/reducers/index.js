import { combineReducers } from 'redux';

import PlayerReducer from './reducerPlayer';
import BoardReducer from './reducerBoard';
import EntityReducer from './reducerEntities';

const allReducers = combineReducers({
	player: PlayerReducer,
	board: BoardReducer,
	entities: EntityReducer,
});

export default allReducers;