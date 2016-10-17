import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions
import {
	dealDmg,
	updateBoard,
} from '../actions';

// containers

// components
import Hud from '../components/hud';
import Screen from '../components/screen';

// logic
import {
	createEmptyMap,
	makeRoom,
	insertRoom
} from '../logic/level';


class Game extends Component {
	componentWillMount() {
		let mapArr = insertRoom(createEmptyMap(), makeRoom(10, 15, 22, 45));
		this.props.updateBoard(mapArr);
	}

	calculateAtk(lvl, wpnDmg = 12) {
		let atk = (12 * lvl) + wpnDmg;
		return atk;
	}

	/**
	 * Returns the visible part of the board/level.
	 * @return {Array} The visible part of the level for the screen
	 * component to render.
	 */
	getScreen() {
		let player = this.props.player;
		let board = this.props.board;
		// Sets camera bounding box around player.
		let offset = 25;

		// Object representing the camera bounding box around the
		// player.
		let camera = {
			top: player.y - offset,
			bottom: player.y + offset
		};

		// Keep the camera within the board.
		if (camera.top < 0) {
			camera.top = 0;
			camera.bottom = camera.top + (2 * offset);
		} else if (camera.bottom > board.length) {
			camera.bottom = board.length;
			camera.top = camera.bottom - (2 * offset);
		}

		return board.splice(camera.top, camera.bottom);
	}

	render() {
		let player = this.props.player;
		return (
			<div className='game'>
				<Hud
				hp={player.hp}
				wpn={player.wpn.name}
				atk={this.calculateAtk(player.lvl, player.wpn.atk)}
				lvl={player.lvl}
				xp={player.xp}
				/>
				<Screen
				screen={this.getScreen()}
				/>
			</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		entities: state.entities,
		player: state.player,
		board: state.board
	};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		dealDmg,
		updateBoard,
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Game);