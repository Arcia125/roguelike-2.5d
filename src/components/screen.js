import React, { Component } from 'react';

const classes = {
	0: 'wall',
	1: 'floor',
	2: 'player',
	3: 'enemy',
	4: 'weapon',
	5: 'health',
	6: 'darkness',
};
class Screen extends Component {
	/**
	 * Returns a className based on the cellValue argument.
	 * @param  {Number} cellValue Value from the this.props.screen array.
	 * @return {String}      CSS class based on cellValue argument.
	 * input:	0		1		2		3		4		5
	 * output:	wall	floor	player	enemy	weapon	health
	 */
	getCellClass(cellValue) {
		return classes[cellValue];
	}

	/**
	 * Creates a grid of html elements. Each row of the grid is a div
	 * containing a row of spans.
	 * @return {JSX Object} A grid of html elements.
	 */
	createScreen() {
		let width = this.props.screen.length;
		let screen = this.props.screen.map((row, rowId) => {
			row = row.map((cellValue, cellId) => {
				let cellClass = 'screen-cell ' + this.getCellClass(cellValue);
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