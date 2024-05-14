const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 4444;
const PALLET_CAPACITY = 100;
const PIECES_INCREMENT_INTERVAL = 10000; // 10 secondes
const COBOT_OPERATING_INTERVAL = 10000; // 10 secondes
const TIME_TO_PICKUP = 7; // Temps de prise de ferdeau en secondes
const TIME_TO_RETURN = 3; // Temps de retour du robot après le déchargement du ferdeau en secondes

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let pieces = 0;
let pallets = 0;

let startTime = null;
let palletizationTime = 0; // Temps écoulé pour la palettisation
let passageTimes = []; // Variable pour stocker les temps entre chaque palettes
let cobotOperatingTime = 0;


function calculateAveragePassageTime() {
    if (passageTimes.length === 0) return 0;
    const totalPassageTime = passageTimes.reduce((acc, time) => acc + time, 0);
    return totalPassageTime / passageTimes.length;
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify({
        handler: "init",
        pieces: pieces,
        pallets: pallets,
        cobotOperatingTime: cobotOperatingTime,
        palletizationTime: palletizationTime,
        timeToPickup: TIME_TO_PICKUP,
        timeToReturn: TIME_TO_RETURN,
        productionOrder: "OF-1000-10000" 
    }));

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Echo: ${message}`);
    });
});

let timeLeftToReturn = 0;
let timeLeftToPickup = 0; // Initialiser le compteur à 0
let pickupInterval;

function startPickupTimer() {
    if (timeLeftToPickup < TIME_TO_PICKUP) {
        timeLeftToPickup++; // Incrémenter le compteur
        console.log(`Temps écoulé pour prendre le ferdeau : ${timeLeftToPickup}s`);
    } else {
        clearInterval(pickupInterval); // Arrêter le compteur une fois que le temps de pickup est écoulé
        timeLeftToPickup = 0; // Réinitialiser le compteur
    }
}
function startReturnTimer() {
    if (timeLeftToReturn < TIME_TO_RETURN) {
        timeLeftToReturn++; // Incrémenter le compteur pour le temps de retour
        console.log(`Temps écoulé pour retourner : ${timeLeftToReturn}s`);
    }
}

// Fonction pour incrémenter le nombre de piècess
function incrementPieces() {
    pieces++;
    // Lorsque le cobot prend le ferdeau, commencer le compteur
    pickupInterval = setInterval(startPickupTimer, 1000);
    cobotOperatingTime += TIME_TO_PICKUP; // Le cobot prend le ferdeau
    cobotOperatingTime += TIME_TO_RETURN; // Le cobot revient après le déchargement
     // Lorsque le cobot prend le ferdeau, commencer le compteur pour le temps de prise
     setInterval(startPickupTimer, 1000);

     // Si le temps de prise est écoulé, commencer le compteur pour le temps de retour
     if (timeLeftToPickup === TIME_TO_PICKUP) {
         setInterval(startReturnTimer, 1000);
     }
    if (pieces % PALLET_CAPACITY === 0) {
        pallets++;
        const elapsedTime = (Date.now() - startTime) / 1000; // Temps écoulé en secondes
        palletizationTime = elapsedTime;
        // Utilisation de ws au lieu de client
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                //client.send(`Nombre de palettes: ${pallets}, Temps écoulé pour la palettisation: ${palletizationTime} secondes`);
                const palletizationData = {
                    handler: "send_data",
                    pallets: pallets,
                    palletizationTime: palletizationTime
                };
                client.send(JSON.stringify(palletizationData));
            }
        });
}

         
    }
    // Envoi des données mises à jour à tous les clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
     
            const piecesData = {
                handler: "send_data",
                pieces: pieces,
                timeToPickup: TIME_TO_PICKUP - timeLeftToPickup, // Envoyer le temps restant pour le pickup
                timeToReturn: TIME_TO_RETURN - timeLeftToReturn // Envoyer le temps restant pour le retour
            };
            client.send(JSON.stringify(piecesData));
        }
    });

// Planifier l'incrémentation du nombre de pièces toutes les secondes
const intervalPieces = setInterval(incrementPieces, PIECES_INCREMENT_INTERVAL);
startTime = Date.now(); // Enregistrer le temps de début

// Planifier l'envoi de l'incrément du temps de fonctionnement du cobot toutes les 10 secondes
const intervalCobot = setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            //client.send(`Temps de fonctionnement du cobot: ${cobotOperatingTime} secondes`);
            const cobotData = {
                handler:"send_data",
                cobotOperatingTime: cobotOperatingTime
            };
            client.send(JSON.stringify(cobotData));
        }
    });
}, COBOT_OPERATING_INTERVAL);

// Arrêter l'incrémentation lorsque le client se déconnecte
wss.on('close', () => {
    clearInterval(intervalPieces);
    clearInterval(intervalCobot);
});

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});