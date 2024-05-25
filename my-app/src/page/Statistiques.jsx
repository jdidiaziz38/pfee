import React, { useState, useEffect } from 'react';
import Card from './Dashboard/Card';
import StatistiqueChart from './StatistiqueChart';

import BasicAreaChart from './BasicAreaChart';
import { w3cwebsocket as WebSocket } from 'websocket';
import DatePicker from 'react-datepicker';
import ProfilePage from './ProfilePage';
import { useLocation, useNavigate } from 'react-router-dom';
import { serviceUser } from '../services/http-client.service';
import PieChart from './PieChart';
const Statistiques = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());


  const navigate = useNavigate(); 
  const location = useLocation(); 
  const refirectPath = serviceUser.verifyConnectUser(location.pathname); 
  if ( !refirectPath.state){  navigate(refirectPath.path);}


  const handlePrint = () => {
    window.print();
  
  };



  const [data, setData] = useState({
    pieces: 0,
    pallets: 0,
    cobotOperatingTime: 0,
    palletizationTime: 0,
    timeToPickup: 7,
    timeToReturn: 0,
    productionOrder: ""
  });

  const PALLET_CAPACITY = 100; // Nombre de pièces par palette
  const TIME_TO_PICKUP = 7;
  const TIME_TO_RETURN = 3;


  useEffect(() => {
    const client = new WebSocket('ws://localhost:4444');
    let interval = null;

    client.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    client.onmessage = (message) => {
      const receivedData = JSON.parse(message.data);
      console.log(receivedData ,"data")
      setData(receivedData);

     
      // Ajouter la logique pour mettre à jour les autres champs en fonction du temps de fonctionnement
      const piecesProduced = Math.floor(receivedData.cobotOperatingTime / 10);
      const newPallets = Math.floor(piecesProduced / PALLET_CAPACITY);
      
      // Mettre à jour les autres champs
      setData(prevData => ({
        ...prevData,
        pieces: piecesProduced,
        pallets: newPallets,
        timeToPickup: TIME_TO_PICKUP,
        timeToReturn: TIME_TO_RETURN, 
        palletizationTime: receivedData.cobotOperatingTime,
        
      }));

      // Vérifier si l'intervalle n'est pas déjà en cours
      if (receivedData.timeToPickup === 7) {
      if (!interval) {
        interval = setInterval(() => {
          setData(prevData => {
            const newTimeToPickup = prevData.timeToPickup > 0 ? prevData.timeToPickup - 1 : 0; // Décrémenter le temps de prise
            const newTimeToReturn = prevData.timeToPickup === 0 ? (prevData.timeToReturn === 0 ? 3 : prevData.timeToReturn - 1) : 0;// Décrémenter le temps de retour lorsque le temps de prise est égal à 0
            return {
              ...prevData,
              cobotOperatingTime: prevData.cobotOperatingTime + 1, // Incrémenter le temps de fonctionnement du cobot
              timeToPickup: newTimeToPickup,
              timeToReturn: newTimeToReturn,
            };
          });
        }, 1000);
      } else {
        // Arrêter le compteur de retour lorsque le temps de prise n'est pas égal à 7
        clearInterval(interval);
        interval = null;
      }
    };
    };

    return () => {
      clearInterval(interval);
      client.close();
    };
  }, []);

  return (
    <div>
      <h2>Statistiques</h2>
      <div className="search-bar">
        <input type="text" placeholder="Rechercher..." />
      <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Date début"
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="Date fin"
        />
        </div>
      
      <div className="row1">
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px"}}>
          <Card icon="pieces" title=" Pièces totales" value={300} />
        </div>
        <div className="col-md-3" style={{ margin: "1%", width: "230px", height: "210px" }}>
          <Card icon="pieces" title="Pièces palettisées" value={data.pieces} />
        </div>
        <div className="col-md-3" style={{ margin: "1%", width: "230px", height: "210px" }}>
          <Card icon="pieces" title="Temps de fonctionnement" value={`${data.cobotOperatingTime} sec`} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px" }}>
          <Card icon="pieces" title=" palette complet" value={`${data.pallets}`} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px" }}>
          <Card icon="pieces" title="Temps de palettisation" value={`${data.palletizationTime} sec`} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px" }}>
          <Card icon="pieces" title="Temps de prise" value={`${data.timeToPickup} sec`} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px" }}>
          <Card icon="pieces" title="Temps de retour" value={`${data.timeToReturn} sec`} />
        </div>
        <div className="col-md-3" style={{margin:"1%", width:"230px", height:"210px" }}>
          <Card icon="pieces" title="Ordre de Fabrication" value={` OF-1000-10000`} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <StatistiqueChart />
        <BasicAreaChart/>
        
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)' ,gap:'10px'}}>
      <PieChart />
      <ProfilePage/>
      
    
      </div>
      
    </div>
  );
};

export default Statistiques;