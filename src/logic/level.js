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
export const makeRandomRoom = ({ x, y }, roomSize = 10) => {
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
	// If any of these conditions are met,
	// return false because the room has coordinate values that fall outside of the map.
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
	if (direction === 'south') {
		// Just returns the room because rooms are generated facing south by default.
		return room;
	} else if (direction === 'north') {
		// Translates the room up by it's height
		return makeRoom(room.height, room.width, room.x, room.y - room.height);
	} else if (direction === 'east') {
		// Switches the room.height and room.width to effectively rotate the room 90 degrees.
		return makeRoom(room.width, room.height, room.x, room.y);
	} else if (direction === 'west') {
		// Switches the room.height and room.width to effectively rotate the room 90 degrees.
		// Also translates the room left by it's width.
		return makeRoom(room.width, room.height, room.x - room.height, room.y);
	}
}

/**
 * Creats a corridor with specified paramaters.
 * @param  {Number}  length            Corridor length or maxLength if random.
 * @param  {Number}  x                 Corridor x coordinate.
 * @param  {Number}  y                 Corridor y coordinate.
 * @param  {String}  direction         Direction to face the corridor.
 * @param  {Boolean} options.random    Optional parameter that determines if a
 *                                     random corridor will be created.
 * @param  {Number}  options.thickness Optional parameter for corridor thickness or width.
 * @param  {Number}  options.minLength Optional parameter for a random corridor's minimum length.
 * @return {Object}                    The created corridor.
 */
export const makeCorridor = (length, x, y, direction, { random = false, thickness = 1, minLength = 2 } = {}) => {
	if (random) {
		return faceRoom(makeRoom(getRandomInt(minLength, length * 1.5), thickness, x, y), direction);
	}
	return faceRoom(makeRoom(length, thickness, x, y), direction);
}

/**
 * Takes the coordinates and direction of a wall and makes a random room connected with a corridor at that point.
 * @param  {Object} {x, y, direction} Coordinates and direction of a wall.
 * @param  {Number} roomSize          Median room size.
 * @return {Object}                   Returns a an object with a corridor and newRoom property.
 */
export const connectRandRoom = ({x, y, direction}, roomSize) => {

	// Make a corridor of a random length at the wall coordinates facing in the direction.
	const corridor = makeCorridor(roomSize, x, y, direction, { random: true });

	const getConnectPoint = () => {
		if (direction === 'south') {
			return corridor.bottomLeft;
		} else if (direction === 'north') {
			return corridor.topLeft;
		} else if (direction === 'east') {
			return corridor.topRight;
		} else if (direction === 'west') {
			return corridor.topLeft;
		}
	}

	let newRoom = faceRoom(makeRandomRoom(getConnectPoint(), roomSize), direction);
	return {
		corridor,
		newRoom
	};
}

/**
 * Returns the center of a random room wall.
 * @param  {Object} room Room object to select wall from.
 * @return {Object}      An object containing coordinates of the wall and the direction it faces.
 */
export const pickRandomWall = (room) => {

	// Gets a random wall side number.
	let wall = getRandomInt(0, 4);

	// 0 = north, 1 = east, 2 = south, 3 = west
	if (wall === 0) {
		return {
			x: room.x + (room.width / 2),
			y: room.y,
			direction: 'north'
		};
	}else if (wall === 1) {
		return {
			x: room.x + room.width,
			y: room.y + (room.height / 2),
			direction: 'east'
		};
	}else if (wall === 2) {
		return {
			x: room.x + (room.width /2 ),
			y: room.y + room.height,
			direction: 'south'

		};
	}else if (wall === 3) {
		return {
			x: room.x,
			y: room.y + (room.height / 2),
			direction: 'west'
		};
	}
}


/**
 * Generates a map of specified height and width filled with the fillValue.
 * @param  {Number} height		Height of the map. Default: 100
 * @param  {Number} width		Width of the map. Defalt: 60
 * @param  {Number} fillValue	Value the map will be filled with. Default: 0
 * @return {Array}				Two dimensional Array representing a map.
 */
export const createEmptyMap = ({ height = 100, width = 60, fillValue = 0} = {}) => {
	const mapArr = [];
	for (let y = 0; y < height; y++) {
		// Create an empty row.
		let mapRow = [];
		for (let x = 0; x < width; x++) {
			// Fill the mapRow.
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
export const insertRoom = (mapArr, room, { fillValue = 1 } = {}) => {
	for (let y = room.y; y < room.y + room.height; y++) {
		mapArr[y] = mapArr[y].fill(fillValue, room.x, room.x + room.width);
	}
	return mapArr;
}


/**
 * Generates a random map.
 * @param  {Number} height    Map height
 * @param  {Number} width     Map width
 * @param  {Number} roomSize  Median room size.
 * @param  {Number} roomCount Desired number of rooms on the generated map.
 * @return {Object}           Generated Map
 */
export const generateRandomMap = ({height = 100, width = 60, roomSize = 8, roomCount = 30} = {}) => {
	// Generate a map full of walls to start.
	const map = createEmptyMap({height, width});

	// Array of rooms generated by the while loop.
	const roomArr = [];

	// Generate the starting room.
	const mainRoomSize = 10;
	roomArr.push({
		corridor: makeRoom(0, 0, 0, 0),
		newRoom: makeRoom(mainRoomSize, mainRoomSize, (width / 2) - (mainRoomSize / 2), (height / 2) - (mainRoomSize / 2))
	});

	// Tracks the number of attempts to prevent an infinite loop.
	const attemptCount = (() => {
		let count = 0;
		return {
			countUp() {
				count += 1;
			},
			lessThan(maxAttempts) {
				return count < maxAttempts;
			},
		};
	})();

	// Fill roomArr with corridors and rooms until either the roomCount or attemptCount is met.
	while (roomArr.length <= roomCount && attemptCount.lessThan(roomCount * 3)) {
		attemptCount.countUp();

		// Pick a random wall of a random room in roomArr as the starting point.
		let randomStartWall = pickRandomWall(roomArr[getRandomInt(0, roomArr.length)].newRoom)
		// Generate a corridor and a connecting room from the randomStartWall.
		let next = connectRandRoom(randomStartWall, roomSize);

		// Only push the new rooms and corridor if they within the map.
		if (roomIsInMap(next.corridor, height, width) && roomIsInMap(next.newRoom, height, width)) {
			roomArr.push(next);
		}
	}

	// puts rooms into the map array
	roomArr.forEach((roomObj) => {
		insertRoom(map, roomObj.corridor, { fillValue: 1 });
		insertRoom(map, roomObj.newRoom, { fillValue: 1 });
	});
	return map;
}
