const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  robotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
},
  timestamp:{
    type: Date,
    required: false
},
  piecesPalatize: {
    type: String,
    required: false
}
});

module.exports = mongoose.model('History', HistorySchema);