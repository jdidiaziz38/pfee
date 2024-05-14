import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HistoriquePage.css';
import { useHistory } from 'react-router-dom';

const HistoriquePage = () => {

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [historyData, setHistoryData] = useState([
    { id: 1, user: { nom: 'John',prenom: 'Doe'}, robot: 'Robot 1', pieces: 100, palletizedPieces: 80 },
    { id: 2, user: { nom: 'Aziz',prenom: 'Jdidi'}, robot: 'Robot 2', pieces: 120, palletizedPieces: 100 },
    { id: 3, user: { nom: 'Adem',prenom: 'Jdidi' }, robot: 'Robot 3', pieces: 90, palletizedPieces: 70 },
    { id: 4, user: { nom: 'Belhsan',prenom: 'Bh' }, robot: 'Robot 4', pieces: 90, palletizedPieces: 70 },
    { id: 5, user: { nom: 'Eya',prenom: 'mabrouk'}, robot: 'Robot 5', pieces: 90, palletizedPieces: 70 },
    { id: 6, user: { nom: 'Tasnim',prenom: 'Hk'}, robot: 'Robot 6', pieces: 90, palletizedPieces: 70 },
  ]);

  const handlePrint = () => {
    window.print('./Statistiques');
    console.log('Printing Statistiques');
    history.push(`/statistiques?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
  };

  return (
    <div className="history-list">
      <h2>Historique</h2>
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>prénom</th>
            <th>Réf Robot</th>
            <th>Nombre de pièces totales</th>
            <th>Nombre de pièces palettisées</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {historyData.map(item => (
    <tr key={item.id}>
      <td className="text-center">{item.user.nom}</td>
      <td className="text-center">{item.user.prenom}</td>
      <td className="text-center">{item.robot}</td>
      <td className="text-center">{item.pieces}</td>
      <td className="text-center">{item.palletizedPieces}</td>
      <td>
        <Button variant="primary" onClick={handlePrint} className="imprimer">
          Imprimer
        </Button>
      </td>
    </tr>
  ))}
</tbody>
      </Table>
     
    </div>
  );
};

export default HistoriquePage;