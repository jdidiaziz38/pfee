import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './page/Sidebar';
import ListUsers from './page/ListUsers';
import ListRobot from './page/ListRobot';
import Login from './page/login';
import Signup from './page/signup'; // Importez le composant Signup
import HistoriquePage from './HistoriquePage';
import Dashboard from './page/Dashboard/Dashboard';
import Statistiques from './page/Statistiques';
import WebSocketClient from './WebSocketClient';

function App() {
  return (
    
    <div className="App">
   
        <BrowserRouter>
          <Routes>
            {/* Page de connexion sans barre latérale */}
            <Route path='/login' element={<LoginWithoutSidebar />} exact />
            {/* Page d'inscription sans barre latérale */}
            <Route path='/signup' element={<SignupWithoutSidebar />} exact />
            {/* Reste de l'application avec la barre latérale */}
            <Route path ='/Statistiques/:robotId' element={<Statistiques/>}/>
            <Route path='/*' element={<MainContentWithSidebar />} />
            
          </Routes>
        </BrowserRouter>
      </div>
    
  );
}


function LoginWithoutSidebar() {
  return (
    <div className="FullWidthPage">
      <Login />
    </div>
  );
}

function SignupWithoutSidebar() {
  return (
    <div className="FullWidthPage">
      <Signup />
    </div>
  );
}

function MainContentWithSidebar() {
  return (
    <div className="MainContentWithSidebar">
      <div className="Sidebar">
        <Sidebar />
      </div>
      <div className="MainContent">
        <Routes>
        
          <Route path='/Dashboard' element={<Dashboard/>} />
          <Route path='/ListUsers' element={<ListUsers />} />
          <Route path='/ListRobot' element={<ListRobot />} />
          <Route path='/HistoriquePage' element={<HistoriquePage />} />
          <Route path='/Statistiques' element={<Statistiques />} />
        </Routes>
      </div>
      <div>
      <WebSocketClient />
    </div>
    </div>
  );
}

export default App;
