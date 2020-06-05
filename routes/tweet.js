

/*eslint-env node*/
//Dependencies
const { Worker, } = require('worker_threads');
const express = require('express');
const router = express.Router();
// const io = require('../app').io;
const fs = require('fs');
const Twit = require('twit');

//Winston Logger
const logger = require('../config/logs');
const dblog = logger.get('dbCon');
const workerLog = logger.get('workerLog');

//Worker
const worker = new Worker('./config/textProcess_worker.js');
const worker1 = new Worker('./config/textProcess_worker.js');
const worker2 = new Worker('./config/textProcess_worker.js');
const worker3 = new Worker('./config/textProcess_worker.js');
const worker4 = new Worker('./config/textProcess_worker.js');
const worker5 = new Worker('./config/textProcess_worker.js');
const worker6 = new Worker('./config/textProcess_worker.js');
const worker7 = new Worker('./config/textProcess_worker.js');

// worker.on('message', msg => {
//     workerLog.info(msg);
// });

// worker1.on('message', msg => {
//     workerLog.info(msg);
// });

// worker2.on('message', msg => {
//     workerLog.info(msg);
// });


//Worker Pool
const workerPool = [worker, worker1, worker2, worker3, worker4, worker5, worker6, worker7];

//Generate a number that corresponds to each index of the array. repeat.
let i = -1;
const inc = (n) => {
    if (n < workerPool.length - 1) {
        n += 1;
        return n;
    }
    return 0;
};


//Gloabl variables
const creds = require('../creds/tweetapiKey');

//Custom Modules
const { DB_Connection: dbConnection, } = require('../config/dbConnection');

//Internal Dependency
const { io, } = require('../app');

//Create a new Twitter crawler instance
const T = new Twit(creds);

//Create a readable stream 
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'], language: 'en', });


//Initialize DB Connection
dbConnection
    .once('open', () => {
        dblog.info('DB Connected');
        //Tweet Stream On
        stream.on('tweet', (twt) => {

            workerPool[inc(i)].postMessage(twt);
            i = inc(i);


        });

    })
    .catch(err => dblog.error('Error Connecting to DB' + ' ' + err));

//API end point
io.on('connection', socket => {

    //Listening for the data request
    socket.on('dataRequest', () => {
        console.log('in');
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