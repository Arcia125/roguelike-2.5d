const config = {

	map: {
		height: 80,
		width: 60,
		roomSize: 12,
		roomCount: 25,
	},

	camera: {
		offset: 15,
		maskRadius: 8,
	},

	finalLevel: 4,

	boss: {
		name: 'BOSS',
		hp: 300,
		atk: 100,
	},

	weapons: [
		{
			name: 'dagger',
			atk: 12,
			lvl: 1,
		},
		{
			name: 'sword',
			atk: 24,
			lvl: 2,
		},
		{
			name: 'great sword',
			atk: 36,
			lvl: 3,
		},
		{
			name: 'katana',
			atk: 48,
			lvl: 4,
		},
		{
			name: 'Molten Dagger',
			atk: 60,
			lvl: 5,
		},
	],

	baseXpBreakpoint: 40,

	classes: {
		0: 'wall',
		1: 'floor',
		2: 'player',
		3: 'enemy',
		4: 'weapon',
		5: 'health',
		6: 'exit',
		7: 'boss',
		99: 'darkness',
	},

	fillValues: {
		wall: 0,
		floor: 1,
		player: 2,
		enemy: 3,
		weapon: 4,
		health: 5,
		exit: 6,
		boss: 7,
		darkness: 99,
	},


};

export default config;