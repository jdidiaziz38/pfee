const Robot = require('../models/Robot');

// Récupérer tous les robots
exports.getRobots = async (req, res) => {
    try {
        const robots = await Robot.find();
        res.json(robots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer un robot par son ID
exports.getRobotById = async (req, res) => {
    try {
        const robot = await Robot.findById(req.params.id);
        if (robot) {
            res.json(robot);
        } else {
            res.status(404).json({ message: "Robot not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRobot = async (req, res) => {
  try {
      const existingRobot = await Robot.findOne({ reference_robot: req.body.reference_robot });
      if (existingRobot) {
          return res.status(400).json({ message: "Un autre robot existe déjà avec cette référence." });
      }

      const robot = new Robot({
          reference_robot: req.body.reference_robot,
          nom_utilisateur: req.body.nom_utilisateur,
          prenom: req.body.prenom,
          ip_robot: req.body.ip_robot,
          nombre_pieces: req.body.nombre_pieces
      });

      const newRobot = await robot.save();
      res.status(201).json(newRobot);
  } catch (error) {
      res.status(400).json({ message: "Une erreur s'est produite lors de la création du robot." });
  }
};

  

// Mettre à jour un robot par son ID
exports.updateRobot = async (req, res) => {
    try {
      const existingRobot = await Robot.findOne({ reference_robot: req.params.ref });
      if (!existingRobot) {
        return res.status(404).json({ message: "Le robot spécifié n'existe pas." });
      }
  
      // Mettre à jour les champs du robot selon les données fournies dans la requête
      if (req.body.nom_utilisateur) {
        existingRobot.nom_utilisateur = req.body.nom_utilisateur;
      }
      if (req.body.ip_robot) {
        existingRobot.ip_robot = req.body.ip_robot;
      }
      
  
      const updatedRobot = await existingRobot.save();
      res.status(200).json(updatedRobot);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
// Supprimer un robot par son ID
exports.deleteRobot = async (req, res) => {
    try {
        const result = await Robot.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: "Robot deleted" });
        } else {
            res.status(404).json({ message: "Robot not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

