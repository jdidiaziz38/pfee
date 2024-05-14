const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4444');

ws.on('open', () => {
    console.log('Connected to WebSocket server');
    
    // Envoyer un message au serveur une fois la connexion établie
    ws.send('Hello, WebSocket server!');
});

ws.on('message', (message) => {
    console.log(`Received from server: ${message}`);
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});
