var style = require('./main.scss');
var html = require('./index.html');

const React = require('react');
const ReactDOM = require('react-dom');

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AllReducers from './reducers';

import Game from './containers/game.js';

let store = createStore(AllReducers, {});

const appAnchor = document.getElementById('app-anchor');

ReactDOM.render(
	<Provider store={store} >
	<Game />
	</Provider>, appAnchor);