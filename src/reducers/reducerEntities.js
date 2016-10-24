const initialEntities = {
	enemies: [],
	weapons: [],
	health: [],
};

export default (state = initialEntities, action) => {
	switch (action.type) {
		case 'ADD_ENTITIES':
			return Object.assign({}, action.entities);
			break;
		case 'DAMAGE_ENEMY':
			return Object.assign({}, state.enemies[action.id]);
			break;
	}
	return state;
}