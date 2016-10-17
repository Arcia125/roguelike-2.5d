import React from 'react';

const Hud = (props) => {
	return (
		<div className='hud-container' >
			<span className='hud-info hp'>{`Health: ${props.hp}`}</span>
			<span className='hud-info wpn'>{`Weapon: ${props.wpn}`}</span>
			<span className='hud-info atk'>{`Attack: ${props.atk}`}</span>
			<span className='hud-info lvl'>{`Level: ${props.lvl}`}</span>
			<span className='hud-info xp'>{`XP: ${props.xp}`}</span>
		</div>
		);

}

export default Hud;