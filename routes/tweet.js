// Dependencies
const express = require('express');
const router = express.Router();

// Controllers
const { map, realtimeDataset, sampleDataset, } = require('../controllers/tweet');

// Render the actual map
router.get('/', map);

// Realtime data set
router.get('/geo', realtimeDataset);

// Sample data set
router.get('/geo1', sampleDataset);

// Export the Module
module.exports = router;