import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { Modal, Button, Form, Input, Select, Alert, Space } from 'antd';
import { MdAdd } from 'react-icons/md';
import { PlusOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const Tableau = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'Utilisateur'
  });
  const [form] = Form.useForm();
  const [alertVisible, setAlertVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState({}); // State pour gérer la visibilité des mots de passe

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    setUserToDelete(data.find((row) => row._id === id));
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3000/users/${userToDelete._id}`, {
        method: 'DELETE',
      });
      setDeleteAlertVisible(true);
      setUserToDelete(null);
      fetchData();
      setTimeout(() => {
        setDeleteAlertVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setEditingUserId(null);
    setNewUser({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: 'Utilisateur',
      photo: ''
    });
    form.resetFields();
  };

  const handleEdit = (id) => {
    const userToEdit = data.find((row) => row._id === id);
    if (userToEdit) {
      setEditingUser(userToEdit);
      form.setFieldsValue({
        nom: userToEdit.nom,
        prenom: userToEdit.prenom,
        email: userToEdit.email,
        password: userToEdit.password,
        role: userToEdit.role
      });
      setShowModal(true);
    }
  }; 
  
                            /* const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: form.getFieldValue('nom'),
          prenom: form.getFieldValue('prenom'),
          email: form.getFieldValue('email'),
          password: form.getFieldValue('password'),
          role: form.getFieldValue('role')
        }),
      });
  
      if (response.ok) {
        // Mise à jour réussie, vous pouvez effectuer les actions nécessaires ici
      } else {
        // Gérer les cas d'erreur, par exemple :
        const errorData = await response.json();
        console.error('Erreur lors de la mise à jour :', errorData);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
    }
  };  */
  

  const handleAdd = () => {
    if (editingUser) {
      setEditingUser(null);
      setEditingUserId(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (values) => {
    try {
      let endpoint = 'http://localhost:3000/users';
      let method = 'POST';

      if (values._id) {
        endpoint += `/${values._id}`;
        method = 'PATCH';
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setAlertVisible(true);
        setShowModal(false);
        fetchData();
      } else {
        throw new Error('Failed to add/update user');
      }
    } catch (error) {
      console.error('Error adding/updating user:', error);
    }
  };

  const filteredData = data.filter((row) => {
    if (filterPeriod === 'lastWeek') {
      const lastWeekDate = new Date();
      lastWeekDate.setDate(lastWeekDate.getDate() - 7);
      return new Date(row.date) >= lastWeekDate;
    }
    if (filterPeriod === 'lastMonth') {
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      return new Date(row.date) >= lastMonthDate;
    }
    if (filterPeriod === 'lastYear') {
      const lastYearDate = new Date();
      lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
      return new Date(row.date) >= lastYearDate;
    }
    return true;
  });

  // Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = (userId) => {
    setPasswordVisible({
      ...passwordVisible,
      [userId]: !passwordVisible[userId]
    });
  };

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      {alertVisible && (
        <Alert
          message="Utilisateur ajouté."
          description=""
          type="success"
          showIcon
        />
      )}
      {deleteAlertVisible && (
        <Alert
          message="Utilisateur supprimé avec succès."
          description=""
          type="success"
          showIcon/>
      )}
      {userToDelete && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Êtes-vous sûr de vouloir supprimer l'utilisateur"
            description={`"${userToDelete.nom}" ?`}
            type="info"
            showIcon
            closable
            onClose={() => setUserToDelete(null)}
          />
          <div style={{ marginTop: '16px' }}>
            <Button size="small" style={{ marginRight: '8px' }} onClick={() => setUserToDelete(null)}>Annuler</Button>
            <Button size="small" danger onClick={confirmDelete}>Supprimer</Button>
          </div>
        </Space>
      )}
      <div>
        <Modal title={editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"} visible={showModal} onCancel={closeModal} footer={null}>
          <Form form={form} onFinish={handleSubmit} initialValues={editingUser || newUser}>
            <Form.Item label="Nom" name="nom" rules={[{ required: true, message: 'Ce champ est requis' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: 'Ce champ est requis' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Ce champ est requis' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Mot de passe" name="password" rules={[{ required: true, message: 'Ce champ est requis' }]}>
              <Input.Password iconRender={visible => (visible ? <EyeTwoTone onClick={() => togglePasswordVisibility(new Date().getTime())} /> : <EyeInvisibleOutlined onClick={() => togglePasswordVisibility(new Date().getTime())} />)} />
            </Form.Item>
            <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Ce champ est requis' }]}>
              <Select defaultValue="Utilisateur">
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="Utilisateur">Utilisateur</Select.Option>
              </Select>
            </Form.Item>
            <Button onClick={closeModal} style={{ marginRight: 8 }}>Annuler</Button>
            <Button type="primary" htmlType="submit">Valider</Button>
          </Form>
        </Modal>
        <button onClick={handleAdd} className="btn-ajouter">
          <MdAdd className="ajouter" />Ajouter
        </button>
      </div>
      <table className="table">
        <thead>
          <tr className="bg-gray-200">
            <th className="etable">Nom</th>
            <th className="etable">Prénom</th>
            <th className="etable">Email</th>
            <th className="etable">Mot de passe</th>
            <th className="etable">Role</th>
            <th className="etable">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={row._id} className="text-center">
              <td className="border px-4 py-2">{row.nom}</td>
              <td className="border px-4 py-2">{row.prenom}</td>
              <td className="border px-4 py-2">{row.email}</td>
              <td className="border px-4 py-2">
                {passwordVisible[row._id] ? (
                  <span>{row.password}</span>
                ) : (
                  <Input.Password value={row.password} readOnly />
                )}
                
              </td>
              <td className="border px-4 py-2">{row.role}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(row._id)} className="edit">
                  <AiOutlineEdit />
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
  );
};

export default Tableau;
