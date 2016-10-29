import React, { Component } from 'react';


class Screen extends Component {
	/**
	 * Creates a grid of html elements. Each row of the grid is a div
	 * containing a row of spans.
	 * @return {JSX Object} A grid of html elements.
	 */
	createScreen() {
		const width = this.props.screen.length;
		const screen = this.props.screen.map((row, rowId) => {
			row = row.map((cellValue, cellId) => {
				const cellClass = 'screen-cell ' + this.props.fillValues[cellValue];
				return (
					<span key={cellId + (rowId * width)} className={cellClass}>
					</span>
					);
			});
			return (
				<div key={rowId + (width * width)} className='screen-row'>
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