const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema({
    reference_robot: {
        type: String,
        required: false
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
        required: false
    }
});

module.exports = mongoose.model('robot', robotSchema);