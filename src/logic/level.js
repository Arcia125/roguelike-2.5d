// return a random integer between min an max.
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * Gets coordinates of a corner of a room.
 * @param  {Object} room   Room the corner will be taken from.
 * @param  {String} corner String name of the corner to be returned.
 * @return {Object}        Coordinates of the corner.
 */
export const getRoomCorner = (roomBasis, corner) => {
	if (corner === 'topLeft') {
		return {
			x: roomBasis.x,
			y: roomBasis.y
		};
	} else if (corner === 'topRight') {
		return {
			x: roomBasis.x + roomBasis.width,
			y: roomBasis.y
		};
	} else if (corner === 'bottomLeft') {
		return {
			x: roomBasis.x,
			y: roomBasis.y + roomBasis.height
		};
	} else if (corner === 'bottomRight') {
		return {
			x: roomBasis.x + roomBasis.width,
			y: roomBasis.y + roomBasis.height
		};
	} else {
		console.log(`Cannot find the corner ${corner}`);
	}
	return {
		x: roomBasis.x,
		y: roomBasis.y
	};
}


/**
 * Generates a room object.
 * @param  {Number} height height of the room object
 * @param  {Number} width  width of the room object
 * @param  {Number} x      x coordinate of the room object
 * @param  {Number} y      y coordinate of the room object
 * @return {Object}        A room object
 */
export const makeRoom = (height, width, x, y) => {
	let roomBasis = {
		height: Math.floor(height),
		width: Math.floor(width),
		x: Math.floor(x),
		y: Math.floor(y),
	};
	return {
		height: roomBasis.height,
		width: roomBasis.width,
		x: roomBasis.x,
		y: roomBasis.y,
		topLeft: getRoomCorner(roomBasis, 'topLeft'),
		topRight: getRoomCorner(roomBasis, 'topRight'),
		bottomLeft: getRoomCorner(roomBasis, 'bottomLeft'),
		bottomRight: getRoomCorner(roomBasis, 'bottomRight')
	};
}

/**
 * Makes a random room at a location the map.
 * @param  {Number} x        Coordinate x
 * @param  {Number} y        Coordinate y
 * @param  {Number} roomSize Approximate desired size of room.
 * @return {Object}          Room object
 */
export const makeRandomRoom = (x, y, roomSize = 10) => {
	let maxRoomSize = Math.floor(roomSize * 1.5) + 1;
	let minRoomSize = Math.floor(roomSize * .3) + 1;
	let height = getRandomInt(minRoomSize, maxRoomSize);
	let width = getRandomInt(minRoomSize, maxRoomSize);
	let room = makeRoom(height, width, x, y);
	return room;
}


/**
 * Returns true if the given room is contained by the map.
 * @return {Boolean}  True if the room is in the map. False if the room isn't in the map.
 */
export const roomIsInMap = (room, mapHeight, mapWidth) => {
	return !(room.x < 0
		|| room.y < 0
		|| room.x > mapWidth
		|| room.y > mapHeight
		|| room.bottomRight.x > mapWidth
		|| room.bottomRight.y > mapHeight);
}


/**
 * Takes a room and faces it in the direction given.
 * @param  {Object} room      Room to be rotated
 * @param  {String} direction Direction to face the room.
 * @return {Object}           Rotated room
 */
export const faceRoom = (room, direction) => {
	let newRoom;
	if (direction === 'south') {
		return room;
	} else if (direction === 'north') {
		newRoom = makeRoom(room.height, room.width, room.x, room.y - room.height);
		return newRoom;
	} else if (direction === 'east') {
		return room;
	} else if (direction === 'west') {
		newRoom = makeRoom(room.width, room.height, room.x - room.height, room.y);
		return newRoom;
	}
	return room;
}

/**
 * Takes the coordinates and direction of a wall and makes a random room connected with a corridor at that point.
 * @param  {Object} {x, y, direction} Coordinates and direction of a wall.
 * @param  {Number} roomSize          Median room size.
 * @return {Object}                   Returns a an object with a corridor and newRoom property.
 */
export const connectRandRoom = ({x, y, direction}, roomSize) => {
	let corridor = faceRoom(makeRoom(getRandomInt(2, (roomSize * 1.5)), 1, x, y), direction);
	let connectPoint;

	if (direction === 'south') {
		connectPoint = corridor.bottomLeft;
	} else if (direction === 'north') {
		connectPoint = corridor.topLeft;
	} else if (direction === 'east') {
		connectPoint = corridor.topRight;
	} else if (direction === 'west') {
		connectPoint = corridor.topLeft;
	} else {
		connectPoint = corridor.bottomLeft;
		console.log(`could not find direction ${direction}`);
	}
	let newRoom = faceRoom(makeRandomRoom(connectPoint.x, connectPoint.y, roomSize), direction);

	return {
		corridor,
		newRoom
	};
}

/**
 * Returns the center of a random room wall.
 * @param  {Object} room Room object to select wall from.
 * @return {Object}      An object containing coordinates of the wall.
 */
export const getRandRoomWall = (room) => {
	let position;
	let wall = getRandomInt(0, 4);
	if (wall === 0) {
		position = {
			x: room.x + (room.width / 2),
			y: room.y,
			direction: 'north'
		};
	}else if (wall === 1) {
		position = {
			x: room.x + room.width,
			y: room.y + (room.height / 2),
			direction: 'east'
		}
	}else if (wall === 2) {
		position = {
			x: room.x + (room.width /2 ),
			y: room.y + room.height,
			direction: 'south'

		}
	}else if (wall === 3) {
		position = {
			x: room.x,
			y: room.y + (room.height / 2),
			direction: 'west'
		}
	}
	return position;
}


/**
 * Generates a map of specified height and width filled with the fillValue.
 * @param  {Number} height		Height of the map. Default: 100
 * @param  {Number} width		Width of the map. Defalt: 60
 * @param  {Number} fillValue	Value the map will be filled with. Default: 0
 * @return {Array}				Two dimensional Array representing a map.
 */
export const createEmptyMap = (
	height = 100,
	width = 60,
	fillValue = 0) => {
	let x, y;
	let mapArr = [];
	let mapRow = [];
	for (y = 0; y < height; y++) {
		// empty mapRow
		mapRow = [];
		for (x = 0; x < width; x++) {
			// fill the mapRow
			mapRow.push(fillValue);
		}
		// push the mapRow onto mapArr
		mapArr.push(mapRow);
	}
	return mapArr;
}

/**
 * Inserts a room into a map.
 * @param  {Array} mapArr		Array representing a map.
 * @param  {Object} room     	Object representing a room.
 * @param  {Number} fillValue	Value to fill the room area of the
 *                            	map array.
 * @return {Array}				The modified map array.
 */
export const insertRoom = (mapArr, room, fillValue = 1) => {
	let y;
	for (y = room.y; y < room.y + room.height; y++) {
		mapArr[y] = mapArr[y].fill(fillValue, room.x, room.x + room.width);
	}
	return mapArr;
}


/**
 * Generates a random map.
 * @param  {Number} height
 * @param  {Number} width
 * @param  {Number} roomSize  Median room size.
 * @param  {Number} roomCount Desired number of rooms on the generated map.
 * @return {Object}           Generated Map
 */
export const generateRandomMap = (height = 100, width = 60, roomSize = 6, roomCount = 50) => {
	// Generate a map full of walls to start.
	let map = createEmptyMap(height, width);

	// Generate the starting room.
	let mainRoomSize = 10;
	let mainRoom = makeRoom(mainRoomSize, mainRoomSize, (width / 2) - (mainRoomSize / 2), (height / 2) - (mainRoomSize / 2));

	// Starting point for each new room. Describes a wall.
	let startPoint;

	// Array of rooms generated by the while loop.
	let roomArr = [];

	// Contains the next corridor and next room to be added to the array.
	let next = {
		corridor: makeRoom(0, 0, 0, 0),
		newRoom: mainRoom
	};
	roomArr.push(next);

	// The room that the next room will be connected to.
	let baseRoom;

	let attemptCount = 0;
	// Fill roomArr with corridors and rooms.
	while (roomArr.length <= roomCount && attemptCount < roomCount * 3) {
		attemptCount += 1;

		// Pick a room from the array of existing rooms at random.
		baseRoom = Object.assign({}, roomArr[getRandomInt(0, roomArr.length)]['newRoom']);

		// Pick a random wall as the start point.
		startPoint = getRandRoomWall(baseRoom);

		// Generate a corridor and a connecting room from the baseRoom startPoint.
		next = connectRandRoom(startPoint, roomSize);

		// Only push the new rooms and corridor if they within the map.
		if (roomIsInMap(next.corridor, height, width) && roomIsInMap(next.newRoom, height, width)) {
			roomArr.push(next);
		}
	}

	// puts rooms into the map array
	roomArr.forEach((roomObj) => {
		insertRoom(map, roomObj.corridor, 1);
		insertRoom(map, roomObj.newRoom, 1);
	});

	return map;
}
