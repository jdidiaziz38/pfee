import React, { useEffect, useState } from 'react';
import Card from '../Dashboard/Card';
import '../Dashboard/Card.css';
import '../Dashboard/Dash.css';
import '../Dashboard/Historigram';
import RobotSlot from '../Dashboard/RobotSlot';
import "./RobotSlot.css";
import Historigram from '../Dashboard/Historigram'; 
import { Alert, Button, Space } from 'antd';
import { state } from '../../states/global.state'; 
import { serviceGlobal, serviceUser } from '../../services/http-client.service';
import { useLocation, useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mssageResponse, setMssageResponse] = useState('');

  const [data, setData] = useState({
    countRobots: 0,
    countUsers: 0,
    totalNombrePieces: 0,
    totalNombrePiecesPalatizes: 0
  });


  const navigate = useNavigate(); 
  const location = useLocation(); 
  const refirectPath = serviceUser.verifyConnectUser(location.pathname); 
  if ( !refirectPath.state){  navigate(refirectPath.path);}


  useEffect(() => {
    fetchData();
    state.wsClient.addMessageListener(handleMessage);
    return () => {
    state.wsClient.removeMessageListener(handleMessage);
    };
  }, []);
  
 
 
  
  const handleMessage = (dataSTR) => {
    try {
    const dataJson = JSON.parse(dataSTR);
   
    if ( ! dataJson.hasOwnProperty('mode')) { console.error('Cant found mode'); return ; } 
    if (dataJson.mode ==  "cnx") {  
     
      if ( ! dataJson.hasOwnProperty('username')) { console.error('Cant found username'); return ; } 
      if ( ! dataJson.hasOwnProperty('status')) { console.error('Cant found status'); return ; } 
        setMssageResponse({description : ` ${dataJson.username} is ${dataJson.status}`});
        console.log (dataJson );
        if ( dataJson.status == "CONNECTED" && dataJson.type =="ROBOT" ){
        setData(prevData => ({
        ...prevData,
        countRobots: prevData.countRobots++
        }));
        }
        if ( dataJson.status == "DISCONNECTED" && dataJson.type =="ROBOT"){
          setData(prevData => ({
            ...prevData,
            countRobots: prevData.countRobots--
            }));
        }
        if ( dataJson.status == "CONNECTED" && dataJson.type =="USER" ){
          setData(prevData => ({
          ...prevData,
          countUsers: prevData.countUsers++
          }));
          }
          if ( dataJson.status == "DISCONNECTED" && dataJson.type =="USER"){
            setData(prevData => ({
              ...prevData,
              countUsers: prevData.countUsers--
              }));
          }
      }
      if (dataJson.mode ==  "data") { 
     if (  !dataJson.hasOwnProperty('content')) {console.error('Cant found content'); return ;}
     if (  dataJson.content.hasOwnProperty('nombre_pieces')) {
      console.log ( dataJson.content.nombre_pieces);
      setData(prevData => ({
        ...prevData,
        totalNombrePiecesPalatizes: prevData.totalNombrePiecesPalatizes + dataJson.content.nombre_pieces
      }));
    }
      }
   
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
  }; 

  const fetchData = async () => {
    try {
      const jsonData =  await serviceGlobal.select();
      setData(jsonData);
    
    } catch (error) {
      console.error('Error fetching data:', error); 
    }
  };
  return (
    <div >
      <h2>Dashboard</h2>
 

      {mssageResponse && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Message"
            description={`"${mssageResponse.description}"`}
            type="info"
            showIcon
            closable
            onClose={() => setMssageResponse(null)}
          />
          <div style={{ marginTop: '16px' }}>
            <Button size="small" style={{ marginRight: '8px' }} onClick={() => setMssageResponse(null)}>ok</Button>
         
          </div>
        </Space>
      )}


        <div className="row1" >
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px"}}>
          <Card icon="pieces" title="Pièces prises" value={data.totalNombrePieces}  />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px"}}>
          <Card icon="facture" title="Pièces palettisées" value={data.totalNombrePiecesPalatizes} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px"}}>
          <Card icon="connected-robots" title="Robots connectés" value={data.countRobots} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px" }}>
          <Card icon="connected-users" title="Utilisateurs connectés" value={data.countUsers} />
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
