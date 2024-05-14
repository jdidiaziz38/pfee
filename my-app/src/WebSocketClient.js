import React, { useEffect } from 'react';

const WebSocketClient = () => {
    useEffect(() => {
        // URL du serveur WebSocket
        const ws = new WebSocket('ws://localhost:4444');

        // Événement de connexion WebSocket
        ws.onopen = () => {
            console.log('Connecté au serveur WebSocket');
        };

        // Événement de réception de messages WebSocket
        ws.onmessage = (event) => {
            console.log('Message reçu du serveur WebSocket: ', event.data);
        };

        // Événement de fermeture de la connexion WebSocket
        ws.onclose = () => {
            console.log('Connexion WebSocket fermée');
        };

        // Fermez la connexion WebSocket lorsque le composant est démonté
        return () => {
            ws.close();
        };
    }, []);

  
};

export default WebSocketClient;
