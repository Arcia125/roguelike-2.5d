require('./main.scss');
require('./index.html');

const React = require('react');
const ReactDOM = require('react-dom');

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AllReducers from './reducers';

import Game from './containers/game.js';

const startGame = () => {
	const store = createStore(AllReducers, {});
	const appAnchor = document.getElementById('app-anchor');
	ReactDOM.render(
		<Provider store={store} >
		<Game />
		</Provider>, appAnchor);
}

window.addEventListener('DOMContentLoaded', startGame, false);

const boundKeys = [87, 38, 68, 39, 83, 65, 37, 40];
window.addEventListener('keydown', function(e) {
	if (boundKeys.includes(e.keyCode)) {
		e.preventDefault();
	}
}, false);
