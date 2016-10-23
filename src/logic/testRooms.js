import {
	makeRoom,
} from './level.js';

const testCases = [
	{
		testId: '1',
		scenario: 'room1 is to the top left of room2',
		room1: { x: 10, y: 10, w: 10, h: 10 },
		room2: { x: 30, y: 30, w: 10, h: 10 },
		expectedResults: {
			overlap: false,
			oneContainsTwo: false,
			twoContainsOne: false,
		},
	},
	{
		testId: '2',
		scenario: 'room1 is above room2',
		room1: { x: 30, y: 10, w: 10, h: 10 },
		room2: { x: 30, y: 30, w: 10, h: 10 },
		expectedResults: {
			overlap: false,
			oneContainsTwo: false,
			twoContainsOne: false,
		},
	},
	{
		testId: '3',
		scenario: 'room1 is to the right of room 2',
		room1: { x: 50, y: 30, w: 10, h: 10 },
		room2: { x: 30, y: 30, w: 10, h: 10 },
		expectedResults: {
			overlap: false,
			oneContainsTwo: false,
			twoContainsOne: false,
		},
	},
	{
		testId: '4',
		scenario: 'The top side of room1 is touching the bottom side of room 2' ,
		room1: { x: 30, y: 40, w: 10, h: 10 },
		room2: { x: 30, y: 30, w: 10, h: 10 },
		expectedResults: {
			overlap: false,
			oneContainsTwo: false,
			twoContainsOne: false,
		},
	},
	{
		testId: '5',
		scenario: 'The bottom right corner of room1 is clipping the top left corner of room2',
		room1: { x: 25, y: 25, w: 10, h: 10 },
		room2: { x: 30, y: 30, w: 10, h: 10 },
		expectedResults: {
			overlap: true,
			oneContainsTwo: false,
			twoContainsOne: false,
		},
	},
	{
		testId: '6',
		scenario: 'room1 is fully contained by room2',
		room1: { x: 35, y: 35, w: 2, h: 2 },
		room2: { x: 30, y: 30, w: 10, h: 10 },
		expectedResults: {
			overlap: true,
			oneContainsTwo: false,
			twoContainsOne: true,
		},
	},
	{
		testId: '7',
		scenario: 'room2 is fully contained by room 1',
		room1: { x: 10, y: 10, w: 10, h: 10 },
		room2: { x: 15, y: 15, w: 1, h: 1 },
		expectedResults: {
			overlap: true,
			oneContainsTwo: true,
			twoContainsOne: false,
		},
	},
	{
		testId: '8',
		scenario: 'room1 and room2 are congruent',
		room1: { x: 30, y: 30, w: 10, h: 10 },
		room2: { x: 30, y: 30, w: 10, h: 10 },
		expectedResults: {
			overlap: true,
			oneContainsTwo: true,
			twoContainsOne: true,
		},
	},
	{
		testId: '9',
		scenario: 'room1 contains the left half of room2',
		room1: { x: 20, y: 20, w: 15, h: 15 },
		room2: { x: 30, y: 30, w: 10, h: 10 },
		expectedResults: {
			overlap: true,
			oneContainsTwo: false,
			twoContainsOne: false,
		},
	},
];

export default testCases;