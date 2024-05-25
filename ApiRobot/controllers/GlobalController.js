const History = require('../models/entity/History');
const Robot = require('../models/entity/Robot');
const User = require('../models/entity/User');
const {  clientService } = require('../services/client.service');
const { historyService } = require('../services/history.service');
 

exports.getAllLengthCollections = async (req, res) => {
  try {
    // Récupération de tous les historiques via le service
    const histories = await historyService.selectAll();

    // Récupération de tous les robots via le modèle Robot
    const robots  =  await Robot.find();

    //(Dashboard) Calcul du nombre total de pièces pour les robots 
    let totalPieces = 0;
    robots.forEach(robot => {totalPieces += robot.nombre_pieces;});

    // Calcul du nombre total de pièces palettisées pour tous les historiques 
    let piecesPalatizes = 0;
    console.log (  clientService.selectAll());
    histories.forEach(hitory => {  piecesPalatizes += parseFloat (hitory.piecesPalatize);   });

   //Envoi de la réponse JSON (yejbed données web socket w y7othom f dashboard en temp reel)
    res.json({
        countRobots: clientService.selectAllRobots().length, //Nombres de robots connecté
        countUsers: clientService.selectAllUsers().length,  //Nombre de utilisateurs connecté
        totalNombrePieces : totalPieces, //Nombre de piéce totale
        totalNombrePiecesPalatizes: piecesPalatizes}); // Nombre de piéces palettisée en temps réel
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};