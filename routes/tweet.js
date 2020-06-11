

/*eslint-env node*/
//Dependencies
const express = require('express');
const router = express.Router();
// const io = require('../app').io;
const fs = require('fs');
const Twit = require('twit');

//Winston Logger
const logger = require('../config/logs');
const dblog = logger.get('dbCon');

//Gloabl variables
const creds = require('../creds/tweetapiKey');

//Internal Dependency
const { io, } = require('../app');
const { csvProcess, } = require('../config/textProcess');

//Create a new Twitter crawler instance
const T = new Twit(creds);

//Create a readable stream 
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'], language: 'en', });



dblog.info('DB Connected');
//Tweet Stream On
stream.on('tweet', (twt) => {

    csvProcess(twt);

});


//API end point
io.on('connection', socket => {

    //Listening for the data request
    socket.on('dataRequest', () => {

        //Read the json file
        fs.readFile('./productionData/dataset.json', 'utf8', (err, geoJson) => {

            //Check for error
            if (err) {
                socket.compress(true).emit('dataOut', 'no');
                return;
            }

            //Send the data to the front end
            socket.compress(true).emit('dataOut', geoJson);
        });

    });

});

//Realtime data set
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

//Sample data set
router.get('/geo1', (req, res) => {
    fs.readFile('./productionData/sampledataset.json', 'utf8', (err, data) => {
        if (err) {
            res.statusCode(400);
            return;
        }
        res.send(data);
    });

});

//Render the actual map
router.get('/', (req, res) => {
    res.render('map');
});



//Export the Module
module.exports = router;

// const cacheMiddleware = require('../config/meCache').cacheMiddleware;

//Read stream
// const geojsonStream = fs.createReadStream('./productionData/dataset.json', 'utf8');

// //End the write stream on exit
// process.on('exit', () => {
//     input.push(null)
// });

// dbStats = change.operationType + " " + `${counter = counter + 1}`;

// //Tweet raw flow monitoring:3000 constant
// let count = [];
// stream.on('tweet', (twt) => {
//     count.push(twt.created_at)
// });

// setTimeout(() => {
//     console.log(count.length)
// }, 60000)

// //Filestream middleware
// const streamW = () => {
//     return (req, res, next) => {
//         geojsonStream.pipe(res)
//         next()

//     }
// }


// router.get('/geostream', streamW(), (req, res) => {
//     //Send the data to the front end
//     res
// });