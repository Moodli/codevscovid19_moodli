// Dependencies
const express = require('express');
const router = express.Router();
const fs = require('fs');
const Twit = require('twit');

// Winston Logger
const logger = require('../config/logs');
const jsonLog = logger.get('jsonLog');

// Gloabl variables
const creds = require('../creds/tweetapiKey');

// Internal Dependency
const { io, } = require('../app');
const { dataTransfer, } = require('../config/workerRelay');

// Redis
const { client, } = require('../config/redisConnection');
const { promisify, } = require('util');
const getAsync = promisify(client.get).bind(client);

// Store the sample dataset in redis
client.set('sample_dataset', fs.readFileSync('./productionData/sampledataset.json'));


// Create a new Twitter crawler instance
const T = new Twit(creds);

// Create a readable stream 
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuarantineLife', 'Quarantine', 'lockdown', 'self-isolate', 'social-distancing', 'masks', 'face masks', 'face mask', 'covid-19', 'covid', 'Vaccine', 'vaccine'], language: 'en', });

// Tweet Stream On
stream.on('tweet', (twt) => {
    dataTransfer(twt);
});


// API endpoints
io.on('connection', socket => {

    // Listening for the data request
    socket.on('dataRequest', async () => {

        // Get the json from redis
        const geoJson = await getAsync('dataset');


        try {
            // Get the length of the json
            const dataPointCount = JSON.parse(geoJson).features.length;

            // Minify JSONs
            const minifyStep1 = JSON.parse(geoJson);
            const minifyStep2 = JSON.stringify(minifyStep1, null, 0);

            // Send the data to the front end
            socket.compress(true).emit('data', [minifyStep2, dataPointCount]);
        } catch (error) {
            jsonLog.error(error);
        }



    });

    // Starting Data
    socket.on('firstRender', async () => {

        // Get the sample dataset from redis
        const geoJson = await getAsync('sample_dataset');


        try {

            // Get the length of the json
            const dataPointCount = JSON.parse(geoJson).features.length;

            // Minify JSONs
            const minifyStep1 = JSON.parse(geoJson);
            const minifyStep2 = JSON.stringify(minifyStep1, null, 0);

            // Send the data to the front end
            socket.compress(true).emit('firstRenderData', [minifyStep2, dataPointCount]);

        } catch (error) {
            jsonLog.error(error);
        }

    });


});

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
    res.render('map');
});

// Export the Module
module.exports = router;