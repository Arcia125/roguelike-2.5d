// return a random integer between min an max.
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * Generates a room object.
 * @param  {Number} height height of the room object
 * @param  {Number} width  width of the room object
 * @param  {Number} x      x coordinate of the room object
 * @param  {Number} y      y coordinate of the room object
 * @return {Object}        A room object
 */
export const makeRoom = (height, width, x, y) => ({height, width, x, y});

// Returns a random number representing a wall of a room.
export const getRandomWall = () => Math.floor(Math.random() * 4);

/**
 * Returns the center of a random room wall.
 * @param  {Object} room Room object to select wall from.
 * @return {[type]}      An object containing coordinates of the wall.
 */
export const getRandRoomWall = (room) => {
	let position;
	let wall = getRandomWall();
	if (wall == 0) {
		position = {
			x: room.x + (room.width / 2),
			y: room.y,
			direction: 'north'
		};
	}else if (wall == 1) {
		position = {
			x: room.x + room.width,
			y: room.y + (room.height / 2),
			direction: 'east'
		}
	}else if (wall == 2) {
		position = {
			x: room.x + (room.width /2 ),
			y: room.y + room.height,
			direction: 'south'

		}
	}else if (wall == 3) {
		position = {
			x: room.x,
			y: room.y + (room.height / 2),
			direction: 'west'
		}
	}else {
		position = {
			x: room.x,
			y: room.y
		}
	}
	return position;
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

export const generateRandomMap = (height = 100, width = 60, roomSize = 10, roomDensity = 6) => {
	// Generate a map full of walls to start
	let map = createEmptyMap(height, width);

	// Generate a large room in the middle of the map.
	let mainRoom = makeRandomRoom((width / 2), (height / 2), Math.floor(roomSize * 1.5));
	map = insertRoom(map, mainRoom);

	let prevRoom = Object.assign({}, mainRoom);
	let currentRoom;
	let startPoint;
	for (let room = 0; room < ((height * width) / roomDensity); room++) {
		currentRoom = Object.assign({}, prevRoom);
		startPoint = getRandomWall(currentRoom);
	}
}
