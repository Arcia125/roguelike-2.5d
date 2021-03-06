import React from 'react';

const Hud = ({ hp, wpn, atk, lvl, xp, maxXp, dungeonLevel, }) => {
	return (
		<div className='hud-container' >
			<span className='hud-info hp'>{`Health: ${hp}`}</span>
			<span className='hud-info wpn'>{`Weapon: ${wpn}`}</span>
			<span className='hud-info atk'>{`Attack: ${atk}`}</span>
			<span className='hud-info lvl'>{`Level: ${lvl}`}</span>
			<span className='hud-info xp'>{`XP: ${xp}/${maxXp}`}</span>
			<span className='hud-info map-level'>{`Dungeon Level: ${dungeonLevel}`}</span>
		</div>
		);

}

export default Hud;