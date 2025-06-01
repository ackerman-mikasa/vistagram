const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seedController');

router.post('/generate', seedController.generateSeedData);

module.exports = router; 