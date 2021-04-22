// Redis
const { getAsync, } = require('./redisConnection');

// Internal Dependency
const { io, } = require('../app');

// Winston Logger
const jsonLog = require('./system/logs').get('jsonLog');


// API endpoints
io.on('connection', socket => {

    // Listening for the data request
    socket.on('dataRequest', async () => {


        try {

            // Get the json from redis
            const geoJson = await getAsync('dataset');

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
