const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema({
    reference_robot: {
        type: String,
        required: false
    },
    nom_utilisateur: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    ip_robot: {
        type: String,
        required: false
    },
    nombre_pieces: {
        type: Number,
        required: false 
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('robot', robotSchema);
