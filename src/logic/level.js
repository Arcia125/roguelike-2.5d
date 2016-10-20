// return a random integer between min and max.
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * Generates a room object.
 * @param  {Number} x      x coordinate of the room object
 * @param  {Number} y      y coordinate of the room object
 * @param  {Number} w  	   width of the room object
 * @param  {Number} h      height of the room object
 * @return {Object}        A room object
 */
const makeRoom = ({x: inputX, y: inputY, w: inputWidth, h: inputHeight, random = false, roomSize} = {}) => {
	const x = Math.floor(inputX);
	const y = Math.floor(inputY);

	// Returns a random room.
	if (random) {
		const makeRandomRoom = () => {
			let randWidth = getRandomInt(roomSize * .5, roomSize * 1.5);
			let randHeight = getRandomInt(roomSize * .5, roomSize * 1.5);
			return makeRoom({ x: x, y: y, w: randWidth, h: randHeight });
		}
		return makeRandomRoom();
	}

	const height = Math.floor(inputHeight);
	const width = Math.floor(inputWidth);
	return {
		x,
		y,
		width,
		height,
		x2: x + width,
		y2: y + height,
	};
}

/**
 * Generates a map of specified height and width filled with the fillValue.
 * @param  {Number} height		Height of the map. Default: 100
 * @param  {Number} width		Width of the map. Defalt: 60
 * @param  {Number} fillValue	Value the map will be filled with. Default: 0
 * @return {Array}				Two dimensional Array representing a map.
 */
const createEmptyMap = ({ height = 100, width = 60, fillValue = 0 } = {}) => {
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
 * Takes a room and faces it in the direction given.
 * @param  {Object} room      Room to be rotated
 * @param  {String} direction Direction to face the room.
 * @return {Object}           Rotated room
 */
const faceRoom = (room, direction) => {
	if (direction === 'south') {
		// Height becomes the largest length between room.width and room.height.
		return makeRoom({ x: room.x, y: room.y, w: room.width, h: room.height });
	} else if (direction === 'north') {
		// Translates the room up by it's height
		return makeRoom({ x: room.x, y: room.y - room.height, w: room.width, h: room.height });
	} else if (direction === 'east') {
		return makeRoom({ x: room.x, y: room.y, w: room.width, h: room.height });
	} else if (direction === 'west') {
		// Translates the room left by it's width.
		return makeRoom({ x: room.x - room.width, y: room.y, w: room.width, h: room.height });
	}
}

const faceCorridor = (corridor, direction) => {
	let longer = Math.max(corridor.height, corridor.width);
	let shorter = Math.min(corridor.height, corridor.width);
	if (direction === 'south') {
		return makeRoom({ x: corridor.x, y: corridor.y, w: shorter, h: longer });
	} else if (direction === 'north') {
		return makeRoom({ x: corridor.x, y: corridor.y - longer, w: shorter, h: longer });
	} else if (direction === 'east') {
		return makeRoom({ x: corridor.x, y: corridor.y, w: longer, h: shorter });
	} else if (direction === 'west') {
		return makeRoom({ x: corridor.x - longer, y: corridor.y, w: longer, h: shorter });
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
const makeCorridor = (length, x, y, direction, { random = false, thickness = 1, minLength = 2 } = {}) => {
	if (random) {
		let randLength = getRandomInt(minLength, length);
		return makeCorridor(randLength, x, y, direction, thickness, minLength);
	}
	return faceCorridor(makeRoom({ x, y, w: thickness, h: length }), direction);
}


/**
 * Returns a random point on a random room wall.
 * @param  {Object} room Room object to select wall from.
 * @return {Object}      An object containing coordinates of the wall and the direction it faces.
 */
const pickRandomWall = (room) => {
	// Gets a random wall side number.
	let wall = getRandomInt(0, 4);

	// 0 = north, 1 = east, 2 = south, 3 = west
	if (wall === 0) {
		return {
			x: getRandomInt(room.x, room.x2),
			y: room.y,
			direction: 'north'
		};
	} else if (wall === 1) {
		return {
			x: room.x2,
			y: getRandomInt(room.y, room.y2),
			direction: 'east'
		};
	} else if (wall === 2) {
		return {
			x: getRandomInt(room.x, room.x2),
			y: room.y2,
			direction: 'south'

		};
	} else if (wall === 3) {
		return {
			x: room.x,
			y: getRandomInt(room.y, room.y2),
			direction: 'west'
		};
	}
}

const randTranslateRoom = (room, translation) => {
	if (translation === 'north') {
		let distance = getRandomInt(0, room.height);
		return makeRoom({ x: room.x, y: room.y - distance, w: room.width, h: room.height });
	} else if (translation === 'east') {
		let distance = getRandomInt(0, room.width);
		return makeRoom({ x: room.x + distance, y: room.y, w: room.width, h: room.height });
	} else if (translation === 'south') {
		let distance = getRandomInt(0, room.height);
		return makeRoom({ x: room.x, y: room.y + distance, w: room.width, h: room.height });
	} else if (translation === 'west') {
		let distance = getRandomInt(0, room.width);
		return makeRoom({ x: room.x - distance, y: room.y, w: room.width, h: room.height });
	}
}

/**
 * Takes the coordinates and direction of a wall and makes a random room connected with a corridor at that point.
 * @param  {Object} {x, y, direction} Coordinates and direction of a wall.
 * @param  {Number} roomSize          Median room size.
 * @return {Object}                   Returns a an object with a corridor and newRoom property.
 */
const connectRandRoom = ({x, y, direction}, roomSize) => {
	// Make a corridor of a random length at the wall coordinates facing in the direction.
	const corridor = makeCorridor(roomSize / 2, x, y, direction, { random: true });

	const getConnectPoint = () => {
		if (direction === 'south') {
			return {
				x: corridor.x,
				y: corridor.y2,
				translation: 'west',
			};
		} else if (direction === 'north') {
			return {
				x: corridor.x,
				y: corridor.y,
				translation: 'west',
			};
		} else if (direction === 'east') {
			return {
				x: corridor.x2,
				y: corridor.y,
				translation: 'north',
			};
		} else if (direction === 'west') {
			return {
				x: corridor.x,
				y: corridor.y,
				translation: 'north',
			};
		}
	}
	const {
		x: connectX,
		y: connectY,
		translation, } = getConnectPoint();

	let newRoom = randTranslateRoom(faceRoom(makeRoom({ x: connectX, y: connectY, random: true, roomSize: roomSize }), direction), translation);

	return {
		corridor,
		newRoom
	};
}

/**
 * Returns true if the given room is contained by the given rectangle.
 * @return {Boolean}  True if room is contained by rectangle.
 */
const roomIsInRect = (room, rect) => {
	// If any of these conditions are met,
	// return false because the room has coordinate values that fall outside of the rectangle.
	return !(room.x < rect.x
		|| room.y < rect.y
		|| room.x2 > rect.x2
		|| room.y2 > rect.y2);
}

/**
 * Compares two rooms to see if they intersect.
 * @param  {Object} room1
 * @param  {Object} room2
 * @return {Boolean}       True if they intersect.
 */
const roomsIntersect = (room1, room2) => {
	return !((room1.x > room2.x2 || room2.x > room1.x2)
		|| (room1.y < room2.y2 || room2.y < room1.y2));
}

/**
 * Compares two rooms to see if they overlap.
 * @param  {Object} room1
 * @param  {Object} room2
 * @return {Boolean}       True if they overlap.
 */
const roomsOverlap = (room1, room2) => {
	return (room1.x < room2.x2 && room1.x2 > room2.x && room1.y < room2.y2 && room1.y2 > room2.y);
}

/**
 * Inserts a room into a map.
 * @param  {Array} mapArr		Array representing a map.
 * @param  {Object} room     	Object representing a room.
 * @param  {Number} fillValue	Value to fill the room area of the
 *                            	map array.
 * @return {Array}				The modified map array.
 */
const insertRoom = (mapArr, room, { fillValue = 1 } = {}) => {
	for (let y = room.y; y < room.y + room.height; y++) {
		mapArr[y] = mapArr[y].fill(fillValue, room.x, room.x + room.width);
	}
	return mapArr;
}

// Adds an array of corridors and rooms to a map.
const insertRoomArray = (roomArray, map) => {
	roomArray.forEach(roomObj => {
		insertRoom(map, roomObj.corridor);
		insertRoom(map, roomObj.newRoom);
	});
	return map;
}


// Returns true if the rooms do intersect with any value in the roomArray.
const newRoomsIntersect = (corridorObj, roomObj, roomArrObj) => {
	const doIntersect = (roomArrObj.some((currentValue) => {
		return roomsIntersect(currentValue.corridor, corridorObj)
			|| roomsIntersect(currentValue.corridor, roomObj)
			|| roomsIntersect(currentValue.newRoom, corridorObj)
			|| roomsIntersect(currentValue.newRoom, roomObj);
		}));
	return doIntersect;
}
// Returns true if the rooms do overlap with any value in the roomArray.
const newRoomsOverlap = (corridorObj, roomObj, roomArrObj) => {
	const doOverlap = (roomArrObj.some((currentValue) => {
		return roomsOverlap(currentValue.corridor, corridorObj)
			|| roomsOverlap(currentValue.corridor, roomObj)
			|| roomsOverlap(currentValue.newRoom, corridorObj)
			|| roomsOverlap(currentValue.newRoom, roomObj);
	}));
	return doOverlap;
}
const newRoomsAreOk = (corridorObj, roomObj, mapRectObj, roomArrObj) => {
	if (!(roomIsInRect(corridorObj, mapRectObj) && roomIsInRect(roomObj, mapRectObj))) {
		return false;
	}
	if (newRoomsIntersect(corridorObj, roomObj, roomArrObj)) {
		return false;
	}
	if (newRoomsOverlap(corridorObj, roomObj, roomArrObj)) {
		return false;
	}
	return true;
}

const pickRandomStartPoint = (roomArray) => {
	let length = roomArray.length;
	let coinToss = getRandomInt(0, 2);
	let selectionIndex = getRandomInt(0, length);
	if (coinToss === 1) {
		return pickRandomWall(roomArray[selectionIndex].newRoom);
	}
	return pickRandomWall(roomArray[selectionIndex].corridor);
}

const getNextRandomRoom = (roomArray, roomSize) => {
	let randomStartPoint = pickRandomStartPoint(roomArray);
	return connectRandRoom(randomStartPoint, roomSize);
}

/**
 * Generates a random map.
 * @param  {Number} height    Map height
 * @param  {Number} width     Map width
 * @param  {Number} roomSize  Median room size.
 * @param  {Number} roomCount Desired number of rooms on the generated map.
 * @return {Object}           Generated Map
 */
export const generateRandomMap = ({ height = 80, width = 60, roomSize = 9, roomCount = 25 } = {}) => {
	// Generate a map full of walls to start.
	let map = createEmptyMap({height, width});
	const mapRect = makeRoom({ x: 0, y: 0, w: width, h: height});

	// Array of rooms generated by the while loop.
	const roomArr = [];

	// Generate the starting room.
	const mainRoomSize = 10;
	roomArr.push({
		corridor: makeRoom({ x: ((width / 2) - (mainRoomSize / 2)), y: ((height / 2) - (mainRoomSize / 2)), w: 0, h:0 }),
		newRoom: makeRoom({ x: ((width / 2) - (mainRoomSize / 2)), y: ((height / 2) - (mainRoomSize / 2)), roomSize: mainRoomSize, random: true }),
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
			getCount() {
				return count;
			},
		};
	})();
	// Fill roomArr with corridors and rooms until either the roomCount or attemptCount is met.
	while (roomArr.length <= roomCount && attemptCount.lessThan(roomCount * 15)) {
		attemptCount.countUp();
		// Get a random corridor and newRoom.
		let nextRoomPair = getNextRandomRoom(roomArr, roomSize);
		// Only push the new rooms and corridor if they within the map.
		if (newRoomsAreOk(nextRoomPair.corridor, nextRoomPair.newRoom, mapRect, roomArr)) {
			roomArr.push(nextRoomPair);
		}
	}

	// puts rooms into the map array
	map = Object.assign([], insertRoomArray(roomArr, map));

	return map;
}
