import { combineReducers } from 'redux';

import PlayerReducer from './reducerPlayer';
import BoardReducer from './reducerBoard';
import WeaponReducer from './reducerWeapons';
import EnemyReducer from './reducerEnemies';
import HealthReducer from './reducerHealths';
import GameStateReducer from './reducerGameState';

const allReducers = combineReducers({
	player: PlayerReducer,
	board: BoardReducer,
	weapons: WeaponReducer,
	enemies: EnemyReducer,
	healths: HealthReducer,
	gameState: GameStateReducer,
});

export default allReducers;