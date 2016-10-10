var style = require('./main.scss');
var html = require('./index.html');

const React = require('react');
const ReactDOM = require('react-dom');

import Game from './app/game.js';

console.log(Game);

ReactDOM.render(<Game/>, document.getElementById('app-anchor'));