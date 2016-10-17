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

export const makeRandomRoom = (mapHeight, mapWidth, roomSize = 10) => {
	let maxRoomSize = roomSize * 1.5;
	let minRoomSize = Math.floor(roomSize * .3);
	// let room = makeRoom(())
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

export const generateRandomMap = (height = 100, width = 60, minRoomSize = 10, maxRoomSize = 30, roomDensity = 6) => {
}
