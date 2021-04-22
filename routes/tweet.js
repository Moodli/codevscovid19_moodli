// Dependencies
const express = require('express');
const router = express.Router();

// Redis
const { getAsync, } = require('../config/database/redisConnection');

// Render URL
let socketUrl = null;
if (process.env.NODE_ENV === 'production') {
    socketUrl = 'https://www.moodli.org';
} else {
    socketUrl = 'http://localhost:3005';
}

// Controllers
const { } = require('../controllers/main');

// Realtime data set
router.get('/geo', async (req, res) => {

    // Get the dataset from redis and send it to the front end
    res.send(await getAsync('dataset'));

});

// Sample data set
router.get('/geo1', async (req, res) => {

    // Get the sample dataset from redis and send it to the front end
    res.send(await getAsync('sample_dataset'));

});

// Render the actual map
router.get('/', (req, res) => {
    res.render('map', {
        url: socketUrl,
    });
});

// Export the Module
module.exports = router;