// Redis
const { getAsync, } = require('../config/database/redisConnection');

// Render URL
let socketUrl = null;
if (process.env.NODE_ENV === 'production') {
    socketUrl = 'https://www.moodli.org';
} else {
    socketUrl = 'http://localhost:3005';
}

// Load tweet stream
require('../config/tweet');

// @desc The home page with the map
// @route GET /
// @access Public
const map = (req, res) => {
    res.render('map', {
        url: socketUrl,
    });
};


// @desc Realtime dataset
// @route GET /geo
// @access Public
const realtimeDataset = async (req, res) => {

    // Get the dataset from redis and send it to the front end
    res.send(await getAsync('dataset'));
};

// @desc Sampledataset
// @route GET /geo1
// @access Public
const sampleDataset = async (req, res) => {
    // Get the sample dataset from redis and send it to the front end
    res.send(await getAsync('sample_dataset'));
};

module.exports = { map, realtimeDataset, sampleDataset, };