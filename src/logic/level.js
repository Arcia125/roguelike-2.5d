import testRooms from './testRooms';
import rng from './randomNumberGenerator';


const level = (() => {
    /**
     * Generates a room object.
     * @param  {Number} x      x coordinate of the room object
     * @param  {Number} y      y coordinate of the room object
     * @param  {Number} w  	   width of the room object
     * @param  {Number} h      height of the room object
     * @return {Object}        A room object
     */
    const makeRoom = ({ x: inputX, y: inputY, w: inputWidth, h: inputHeight, random = false, roomSize } = {}) => {
        const x = Math.floor(inputX);
        const y = Math.floor(inputY);

        // Returns a random room.
        if (random) {
            const makeRandomRoom = () => {
                const randWidth = rng.getRandomInt(roomSize * .4, roomSize * 1.5);
                const randHeight = rng.getRandomInt(roomSize * .4, roomSize * 1.5);
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
        const longer = Math.max(corridor.height, corridor.width);
        const shorter = Math.min(corridor.height, corridor.width);
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
            const randLength = rng.getRandomInt(minLength, length);
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
        const wall = rng.getRandomInt(0, 4);

        // 0 = north, 1 = east, 2 = south, 3 = west
        if (wall === 0) {
            return {
                x: rng.getRandomInt(room.x, room.x2),
                y: room.y,
                direction: 'north'
            };
        } else if (wall === 1) {
            return {
                x: room.x2,
                y: rng.getRandomInt(room.y, room.y2),
                direction: 'east'
            };
        } else if (wall === 2) {
            return {
                x: rng.getRandomInt(room.x, room.x2),
                y: room.y2,
                direction: 'south'

            };
        } else if (wall === 3) {
            return {
                x: room.x,
                y: rng.getRandomInt(room.y, room.y2),
                direction: 'west'
            };
        }
    }

    const randTranslateRoom = (room, translation) => {
        if (translation === 'north') {
            const distance = rng.getRandomInt(0, room.height);
            return makeRoom({ x: room.x, y: room.y - distance, w: room.width, h: room.height });
        } else if (translation === 'east') {
            const distance = rng.getRandomInt(0, room.width);
            return makeRoom({ x: room.x + distance, y: room.y, w: room.width, h: room.height });
        } else if (translation === 'south') {
            const distance = rng.getRandomInt(0, room.height);
            return makeRoom({ x: room.x, y: room.y + distance, w: room.width, h: room.height });
        } else if (translation === 'west') {
            const distance = rng.getRandomInt(0, room.width);
            return makeRoom({ x: room.x - distance, y: room.y, w: room.width, h: room.height });
        }
    }

    /**
     * Takes the coordinates and direction of a wall and makes a random room connected with a corridor at that point.
     * @param  {Object} {x, y, direction} Coordinates and direction of a wall.
     * @param  {Number} roomSize          Median room size.
     * @return {Object}                   Returns a an object with a corridor and newRoom property.
     */
    const getCorridorAndRoom = ({ x, y, direction }, roomSize) => {
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
            translation,
        } = getConnectPoint();

        const newRoom = randTranslateRoom(faceRoom(makeRoom({ x: connectX, y: connectY, random: true, roomSize: roomSize }), direction), translation);

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
        return !(room.x < rect.x || room.y < rect.y || room.x2 > rect.x2 || room.y2 > rect.y2);
    }


    /**
     * Compares two rooms to see if they overlap.
     * @param  {Object} room1
     * @param  {Object} room2
     * @return {Boolean}       True if they overlap.
     */
    const roomsOverlap = (room1, room2) => {
        // return (room1.x < room2.x2 && room1.x2 > room2.x && room1.y < room2.y2 && room1.y2 > room2.y);
        return (room1.x < room2.x2 && room1.x2 > room2.x && room1.y < room2.y2 && room1.y2 > room2.y) || (room2.x < room1.x2 && room2.x2 > room1.x && room2.y < room1.y2 && room2.y2 > room1.y);
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

    /**
     * Conducts the testFunc callback on the given corridor and room using Array.some on the roomArrObj.
     * @param  {Object} corridorObj [description]
     * @param  {[type]} roomObj     [description]
     * @param  {[type]} roomArrObj  [description]
     * @param  {[type]} testFunc    [description]
     * @return {[type]}             [description]
     */
    const compareRoomsToArray = (corridorObj, roomObj, roomArrObj, testFunc) => {
        const testIsTrue = (roomArrObj.some((currentValue) => {
            return testFunc(currentValue.corridor, corridorObj) || testFunc(currentValue.corridor, roomObj) || testFunc(currentValue.newRoom, corridorObj) || testFunc(currentValue.newRoom, roomObj);
        }));
        return testIsTrue;
    }

    const newRoomsAreOk = (corridorObj, roomObj, mapRectObj, roomArrObj) => {
        if (!(roomIsInRect(corridorObj, mapRectObj) && roomIsInRect(roomObj, mapRectObj))) {
            return false;
        }
        if (compareRoomsToArray(corridorObj, roomObj, roomArrObj, roomsOverlap)) {
            return false;
        }
        return true;
    }

    const pickRandomStartPoint = (roomArray) => {
        const length = roomArray.length;
        const coinToss = rng.getCoinFlip();
        const selectionIndex = rng.getRandomInt(0, length);
        if (rng.getChance(20)) {
            return pickRandomWall(roomArray[selectionIndex].newRoom);
        }
        return pickRandomWall(roomArray[selectionIndex].corridor);
    }

    const getRoomPair = (roomArray, roomSize) => {
        const randomStartPoint = pickRandomStartPoint(roomArray);
        const randomRoomPair = getCorridorAndRoom(randomStartPoint, roomSize);
        return randomRoomPair;
    }

    const roomTest = (testObjArray) => {
        testObjArray.forEach(({ testId, scenario, room1, room2, expectedResults }) => {
            const room1Obj = makeRoom(room1);
            const room2Obj = makeRoom(room2);
            console.log(`Test Number: ${testId}
			Scenario: ${scenario}
			overlap:
				Outcome: ${roomsOverlap(room1Obj, room2Obj)}
				Expected: ${expectedResults.overlap}
			twoContainsOne
				Outcome: ${roomIsInRect(room1Obj, room2Obj)}
				Expected: ${expectedResults.twoContainsOne}
			oneContainsTwo
				Outcome: ${roomIsInRect(room2Obj, room1Obj)}
				Expected: ${expectedResults.oneContainsTwo}
			`);
        });
    }

    /**
     * Generates a random map.
     * @param  {Number} height    Map height
     * @param  {Number} width     Map width
     * @param  {Number} roomSize  Median room size.
     * @param  {Number} roomCount Desired number of rooms on the generated map.
     * @return {Object}           Generated Map
     */
    const generateRandomMap = (playerStartX, playerStartY, { height = 80, width = 60, roomSize = 10, roomCount = 30, } = {}) => {

        // Generate a map full of walls to start.
        let map = createEmptyMap({ height, width });
        const mapRect = makeRoom({ x: 0, y: 0, w: width, h: height });

        // Array of rooms generated by the while loop.
        const roomArr = [];

        // Generate the starting room.
        const mainRoomSize = Math.floor(roomSize * 1.1);
        const originX = playerStartX || Math.floor((width / 2) - (mainRoomSize / 2));
        const originY = playerStartY || Math.floor((height / 2) - (mainRoomSize / 2));
        roomArr.push({
            corridor: makeRoom({ x: originX, y: originY, w: 0, h: 0 }),
            newRoom: makeRoom({ x: originX, y: originY, roomSize: mainRoomSize, random: true }),
        });

        // Tracks the number of attempts to prevent an infinite loop.
        const attemptCount = (() => {
            let count = 0;
            let maxAttempts;
            return {
                add(amount) {
                    count += amount;
                },
                setMaxAttempts(max) {
                    maxAttempts = max;
                },
                lessThanMax() {
                    return count < maxAttempts;
                },
                getCount() {
                    return count;
                },
            };
        })();

        // Fill roomArr with corridors and rooms until either the roomCount or attemptCount is met.
        attemptCount.setMaxAttempts(roomCount * 25);
        while (roomArr.length <= roomCount && attemptCount.lessThanMax()) {
            attemptCount.add(1);

            // Get a random corridor and newRoom.
            const nextRoomPair = getRoomPair(roomArr, roomSize);
            // Only push the new rooms and corridor if they within the map.
            if (newRoomsAreOk(nextRoomPair.corridor, nextRoomPair.newRoom, mapRect, roomArr)) {
                roomArr.push(nextRoomPair);
            }
        }

        // puts rooms into the map array
        map = Object.assign([], insertRoomArray(roomArr, map));

        // Randomly add enemies, weapons, and health packs to the level.
        map = map.map(row => {
            const newRow = row.map(cell => {
                // If the cell is a floor cell. Potentially add an enemy, weapon, or health pack.
                if (cell === 1) {
                    const rand = rng.getRandomInt(0, 1000)
                    // Replace the floor cell with an enemy.
                    if (rand <= 3) {
                        return 3;
                    }
                    // Replace the floor cell with a weapon.
                    if (rand === 4) {
                        return 4;
                    }
                    // Replace the floor cell with a health pack.
                    if (rand === 5) {
                        return 5;
                    }
                }
                return cell;
            });
            return newRow;
        });

        let levelExitFound = false;
        while (levelExitFound === false) {
        	const randY = rng.getRandomInt(0, height);
        	const randX = rng.getRandomInt(0, width);
        	if (map[randY][randX] === 1) {
        		map[randY][randX] = 6;
        		levelExitFound = true;
        	}
        }

        // Return the generated level.
        return map;
    }

    return {
    	createEmptyMap,
    	generateRandomMap,
    };

})();

export default level;