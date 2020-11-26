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

// Create a new Twitter crawler instance
const T = new Twit(creds);

// Create a readable stream 
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'], language: 'en', });

// Tweet Stream On
stream.on('tweet', (twt) => {
    dataTransfer(twt);
});

// API endpoints
io.on('connection', socket => {

    // Listening for the data request
    socket.on('dataRequest', () => {

        // Read the json file
        fs.readFile('./productionData/dataset.json', 'utf8', (err, geoJson) => {

            // Check for error
            if (err) {
                socket.compress(true).emit('dataOut', 'no');
                return;
            }

            try {
                // Minify JSONs
                const minifyStep1 = JSON.parse(geoJson);
                const minifyStep2 = JSON.stringify(minifyStep1, null, 0);

                // Send the data to the front end
                socket.compress(true).emit('dataOut', minifyStep2);
            } catch (error) {
                jsonLog.error(error);
            }

        });

    });

    // Listening for data point count request
    socket.on('dataPoint', () => {

        // Read the json file and count the length
        fs.readFile('./productionData/dataset.json', 'utf8', (err, geoJson) => {

            //Check for error
            if (err) {
                socket.compress(true).emit('dataPoints', 'no');
                return;
            }

            try {
                const dataPointCount = JSON.parse(geoJson).features.length;
                //Send the data to the front end
                socket.compress(true).emit('dataPoints', dataPointCount);
            } catch (error) {
                jsonLog.error(error);
            }


        });

    });

    // Starting Data
    socket.on('firstRender', () => {
        // Read the json file and count the length
        // Read the json file
        fs.readFile('./productionData/sampledataset.json', 'utf8', (err, geoJson) => {

            // Check for error
            if (err) {
                socket.compress(true).emit('firstRenderData', 'no');
                return;
            }


            try {

                // Minify JSONs
                const minifyStep1 = JSON.parse(geoJson);
                const minifyStep2 = JSON.stringify(minifyStep1, null, 0);

                // Send the data to the front end
                socket.compress(true).emit('firstRenderData', minifyStep2);

            } catch (error) {
                jsonLog.error(error);
            }

        });
    });

    socket.on('firstRenderPointCount', () => {
        // Read the json file and count the length
        fs.readFile('./productionData/sampledataset.json', 'utf8', (err, geoJson) => {

            // Check for error
            if (err) {
                socket.compress(true).emit('firstRenderPCounts', 'no');
                return;
            }

            try {
                const dataPointCount = JSON.parse(geoJson).features.length;
                // Send the data to the front end
                socket.compress(true).emit('firstRenderPCounts', dataPointCount);
            } catch (error) {
                jsonLog.error(error);
            }
        });
    });
});

// Realtime data set
router.get('/geo', (req, res) => {

    //  Read from dataset.json the serve so it detects the file change
    // Setting fix vars. will only read the file once upon startup
    fs.readFile('./productionData/dataset.json', 'utf8', (err, data) => {

        if (err) {
            res.statusCode(500);
            return;
        }
        res.send(data);
    });

});

// Sample data set
router.get('/geo1', (req, res) => {
    fs.readFile('./productionData/sampledataset.json', 'utf8', (err, data) => {
        if (err) {
            res.statusCode(400);
            return;
        }
        res.send(data);
    });

});

// Render the actual map
router.get('/', (req, res) => {
    res.render('map');
});

// Export the Module
module.exports = router;