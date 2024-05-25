const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Get all history
router.get('/', historyController.getAllHistory);

// Create new history entry
router.post('/', historyController.createHistory);

module.exports = router;
