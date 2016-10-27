import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class CombatLog extends Component {

	componentDidMount() {
		this.node = document.getElementsByClassName('log')[0];
	}

	createLog() {
		let log = this.props.log.slice(-15).map(msg => {
			return(
				<span
					key={msg.id}
					className={'msg ' + msg.logLevel}
				>
					{msg.msg}
				</span>
				);
		});
		return log;
	}

	componentDidUpdate() {
		this.node.scrollTop = this.node.scrollHeight;
	}

	render() {
		return (
			<div className='log'>
				<div className='msg-container'>
					
					{this.createLog()}
				</div>
			</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		log: state.log,
	};
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(CombatLog);
