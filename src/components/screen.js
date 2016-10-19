import React, { Component } from 'react';


class Screen extends Component {
	/**
	 * Returns a className based on the cell argument.
	 * @param  {Number} cell Value from the this.props.screen array.
	 * @return {String}      CSS class based on cell argument.
	 * input:	0		1		2		3		4		5
	 * output:	wall	floor	player	enemy	weapon	health
	 */
	getCellClass(cell) {
		switch (cell) {
			case 0:
				return 'wall';
				break;
			case 1:
				return 'floor';
				break;
			case 2:
				return 'player';
				break;
			case 3:
				return 'enemy';
				break;
			case 4:
				return 'weapon';
				break;
			case 5:
				return 'health';
				break;
		}
	}

	/**
	 * Creates a grid of html elements. Each row of the grid is a div
	 * containing a row of spans.
	 * @return {JSX Object} A grid of html elements.
	 */
	createScreen() {
		let width = this.props.screen.length;
		let screen = this.props.screen.map((row, rowId) => {
			row = row.map((cell, cellId) => {
				let cellClass = 'screen-cell ' + this.getCellClass(cell);
				return (
					<span id={`x-${cellId}_y-${rowId}`} key={cellId + (rowId * width)} className={cellClass}>
					</span>
					);
			});
			return (
				<div id={rowId + (width * width)} key={rowId + (width * width)} className='screen-row'>
					{row}
				</div>
				);
		});
		return screen;
	}

	render() {
		return (
			<div className='screen' >
				{this.createScreen()}
			</div>
			);
	}
}

export default Screen;