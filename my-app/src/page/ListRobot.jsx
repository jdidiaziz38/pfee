import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Modal, Button, Form, Input } from 'antd';
import { MdAdd } from 'react-icons/md';
import { Alert, Space } from 'antd';
import "./ListUsers.css";
import image from '../page/roboticone.png';

const Tableau = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showModal, setShowModal] = useState(false); // État pour contrôler la visibilité du modal d'ajout
  const [alertVisible, setAlertVisible] = useState(false);
  const [closeModal, setclosemodal] = useState(false);
  const [onCancel, setOnCancel] = useState(false);
  const [robotToDelete, setRobotToDelete] = useState(null);
  const [handleEdit, sethandleedit] = useState(false);
  const [editingRobot, setEditingRobot] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [newRobot, setNewRobot] = useState({
    image: '',
    nomUtilisateur: '',
    prenom :'',
    reference: '',
    IPRobot: '',
    nombrePieces: ''

  });
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("hellooo");
        const response = await fetch('http://localhost:3000/robots');
        const jsonData = await response.json(); // Convertir la réponse en JSON
        setData(jsonData); // Mettre à jour l'état data avec les données récupérées
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlertVisible(true);
      }
    };
    fetchData(); // Appeler la fonction fetchData pour récupérer les données au chargement de la page
  }, []); // Utiliser un tableau vide comme deuxième argument pour exécuter useEffect une seule fois au chargement de la page
  

  const handleAddClick = () => {
    setShowModal(true); // Ouvrir le modal d'ajout lorsque vous cliquez sur "Ajouter"
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  
   // Fonction pour récupérer les données depuis la base de données

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:3000/robots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: values.reference, // Utiliser la clé "ref" attendue par le backend
          user: values.nomUtilisateur, // Utiliser la clé "user" attendue par le backend
          prenom : values.prenom,
          ip: values.IPRobot, // Utiliser la clé "ip" attendue par le backend
          nbrpieces :values.nombrePieces
        }),
      });
      if (response.ok) {
        const newRobot = await response.json();
        console.log("hello");
        setData(prevData => [...prevData, newRobot]);
        setShowModal(false);
        setNewRobot({ // Reset the newRobot state after successful submission
        reference: '',
        nomUtilisateur: '',
        prenom :'',
        IPRobot: '',
        nombrePieces :''
      });
    } else {
      throw new Error('Add request failed');
    }
  } catch (error) {
    console.error('Error adding robot:', error);
    setAlertVisible(true);
  }
};
  const handleDelete = async (id) => {
    console.log(id , "id");
    console.log(data.find((row) => row._id ) , "id");
    setRobotToDelete(data.find((row) => row._id === id));
  };
  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3000/robots/${robotToDelete._id}`, {
        method: 'DELETE',
      });
      setRobotToDelete(null);
      getData(); // Met à jour les données après la suppression
      setTimeout(() => {
        setAlertVisible(false); // Cacher l'alerte après 3 secondes
      }, 3000);
    } catch (error) {
      console.error('Error deleting robot:', error);
      setAlertVisible(true);
    }
  };
  
  const filteredData = data.filter((row) => {
    // Filtre des données localement sans tenir compte de la période
    return true; // Retourne toutes les données
  });
 


  return (
    <div>
      <h2>Liste des robots</h2>
      {alertVisible && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert message="Error" type="error" showIcon />
          <Alert
            message="Error"
            description="Erreur de récupération des données."
            type="error"
            showIcon
          />
        </Space>
      )}
     {robotToDelete && (
      <>
        <Alert
          message="Êtes-vous sûr de vouloir supprimer le  robot  ?"
          description={`"${robotToDelete.reference_robot}" ?`}
          type="info"
          showIcon
          closable
          onClose={() => setRobotToDelete(null)}
          />
          <div style={{ marginTop: '16px' }}>
            <Button size="small" style={{ marginRight: '8px' }} onClick={() => setRobotToDelete(null)}>Annuler</Button>
            <Button size="small" danger onClick={confirmDelete}>Supprimer</Button>
          </div>
        </> 
      )}
      
      <div>
        <Modal title="Ajouter un robot" visible={showModal} onCancel={handleModalClose} footer={null}>
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Référence de Robot"
              name="reference"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Input
                value={newRobot.reference}
                onChange={(e) => setNewRobot({
                  ...newRobot,
                  reference: e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                })}
                placeholder="ex :AA001BE"
              />
            </Form.Item>

            <Form.Item
              label="Nom utilisateur"
              name="nomUtilisateur"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Input
                value={newRobot.nomUtilisateur}
                onChange={(e) => setNewRobot({
                  ...newRobot,
                  nomUtilisateur: e.target.value.replace(/[^a-zA-Z]/g, '')
                })}
                placeholder="Entrez le nom de l'utilisateur"
              />
            </Form.Item>
            <Form.Item
              label="Prenom"
              name="Prenom"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Input
                value={newRobot.prenom}
                onChange={(e) => setNewRobot({
                  ...newRobot,
                  prenom: e.target.value.replace(/[^a-zA-Z]/g, '')
                })}
                placeholder="Entrez le nom de l'utilisateur"
              />
            </Form.Item>

            <Form.Item
              label="IP Robot"
              name="IPRobot"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
            >
              <Input
                value={newRobot.IPRobot}
                onChange={(e) => setNewRobot({
                  ...newRobot,
                  IPRobot: e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                })}
                placeholder="000.00.0.000"
              />
            </Form.Item>
            <Form.Item
             label="Nombre de pièces"
             name="nombrePieces"
              rules={[{ required: true, message: 'Ce champ est requis' }]}
             >
            <Input
             value={newRobot.nombrePieces}
               onChange={(e) => setNewRobot({
               ...newRobot,
              nombrePieces: e.target.value.replace(/[^0-9]/g, '') // Restriction aux chiffres uniquement
              })}
            placeholder="Entrez le nombre de pièces"
            />
            </Form.Item>

            <Button onClick={closeModal} style={{ marginRight: 8 }}>
              Annuler
            </Button>
            <Button type="primary" htmlType="submit">
              Valider
            </Button>
          </Form>
        </Modal>
        <div>
      


        <button onClick={handleAddClick} className="btn-ajouter">
       <MdAdd className="ajouter" />Ajouter
        </button>

        <div className="Rechercher">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rechercher2"
          />
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="filter"
          >
            <option value="all">Toutes les périodes</option>
            <option value="lastWeek">Semaine dernière</option>
            <option value="lastMonth">Mois dernier</option>
            <option value="lastYear">Année dernière</option>
          </select>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr className="bg-gray-200">
            <th className="etable">Image</th>
            <th className="etable">Référence de Robot</th>
            <th className="etable">Nom </th>
            <th className="etable">prenom</th>
            <th className="etable">IP Robot</th>
            <th className="etable">Nombres des piéces</th>
            <th className="etable">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row._id} className="text-center">
              <td className="border px-4 py-2">
                <img src={image} alt="robot" style={{width: '50px', height: '50px'}} />
              </td>
              <td className="border px-4 py-2">{row.reference_robot}</td>
              <td className="border px-4 py-2">{row.nom_utilisateur}</td>
              <td className="border px-4 py-2">{row.prenom}</td>
              <td className="border px-4 py-2">{row.ip_robot}</td>
              <td className="border px-4 py-2">{row.nombre_pieces}</td>
              <td className="border px-4 py-2"> 
                
        
              <button onClick={() => setIsEditing(true)} className="edit">
                  <AiOutlineEdit  />
                  </button>
                <button onClick={() => handleDelete(row._id)} className="edit">
                  <AiOutlineDelete />
                </button>

              </td>
            </tr> 
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Tableau;