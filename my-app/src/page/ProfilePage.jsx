import React from 'react';
import './Profile.css';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn // Import du composant de bouton de MDB React UI Kit
} from 'mdb-react-ui-kit';


export default function ProfilePage() {
  return (
      <MDBCard className="partie1">
        <div>
        <MDBCardImage
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
          alt="avatar"
          className="rounded-circle avatar-image"
        />
        <p className="text">Jdidi aziz </p>
        <p className="text-success">Robot connecté</p> 
        </div>
        <MDBCardBody>
<div style={{float:'right'}}>
          
          
          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Nom</span>
              <span className="info-value">Jdidi </span>
            </div>
            <hr />
            <div className="info-row">
              <span className="info-label">Prénom</span>
              <span className="info-value">Aziz</span>
            </div>
            <hr />
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">jdidiaziz38@gmail.com</span>
            </div>
            <hr />
            <div className="info-row">
              <span className="info-label">Mot de passe </span>
              <span className="info-value">  *******</span>
            </div>
            <hr />
            <div className="info-row">
              <span className="info-label">Role</span>
              <span className="info-value">Admin</span>
            </div>
           
          </div>
          </div>
          

        </MDBCardBody>
      </MDBCard>
      
   
  );
}