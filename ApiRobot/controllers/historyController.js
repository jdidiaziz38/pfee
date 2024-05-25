const History = require('../models/entity/History');
const Robot = require('../models/entity/Robot');
const { historyService } = require('../services/history.service');
 
exports.getAllHistory = async (req, res) => {
  try {
    const histories = await historyService.selectAll();
    res.json(histories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};