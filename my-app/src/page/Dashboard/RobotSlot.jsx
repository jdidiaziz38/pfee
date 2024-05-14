import React from 'react';
import roboticone from '../roboticone.png';

const RobotSlot = ({ id }) => {
  return (
    <div className="robot-slot" style={{margin:"1%", width:"230px", height:"210px"}}> 
      <img src={roboticone} alt={`Robot ${id}`} />
      Robot1
      <div className="slot-buttons">
        <button className="stats-button">Statistiques</button>
        <button className="history-button">Historique</button>
      </div>
    </div>
  );
};

export default RobotSlot;