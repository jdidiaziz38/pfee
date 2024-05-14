import React, { useState } from 'react';
import Card from '../Dashboard/Card';
import '../Dashboard/Card.css';
import '../Dashboard/Dash.css';
import '../Dashboard/Historigram';
import RobotSlot from '../Dashboard/RobotSlot';
import "./RobotSlot.css";
import Historigram from '../Dashboard/Historigram';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div >
      <h2>Dashboard</h2>
        <div className="row1" >
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px"}}>
          <Card icon="pieces" title="Pièces prises" value={7000} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px"}}>
          <Card icon="facture" title="Pièces palettisées" value={5267} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px"}}>
          <Card icon="connected-robots" title="Robots connectés" value={5} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px" }}>
          <Card icon="connected-users" title="Utilisateurs connectés" value={5} />
        </div>
       </div>
      <div><Historigram/></div>
      <div className="robot-slots-container" >
        <RobotSlot/> 
        <RobotSlot/> 
        <RobotSlot/>
        <RobotSlot/>
      </div>
    </div>
  );
};

export default Dashboard;
