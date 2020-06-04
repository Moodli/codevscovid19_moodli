

/*eslint-env node*/
//Dependencies
const express = require('express');
const router = express.Router();
// const io = require('../app').io;
const fs = require('fs');
const Twit = require('twit');

//Gloabl variables
const creds = require('../creds/tweetapiKey');

//Custom Modules
const { locationFilter, dataPrep, } = require('../config/textProcess');
const { DB_Connection: dbConnection, } = require('../config/dbConnection');

//Internal Dependency
const { io, } = require('../app');

//Create a new Twitter crawler instance
const T = new Twit(creds);

const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'], language: 'en', });

//Winston Logger
const dblog = require('../config/logs').get('dbCon');

//Initialize DB Connection
dbConnection
    .once('open', () => {
        dblog.info('DB Connected');

        //Load Model for tweetDB
        require('../schema/tweetSchema');
        const tweetDB = dbConnection.model('tweet');

        //MongoDB Change Stream
        const changeStream = tweetDB.watch();

        //Tweet Stream On
        stream.on('tweet', (twt) => {

            //Get rid of all the undefs
            if ((locationFilter(twt.user.location)) != 'fup') {
                //Get rid of all the empty tweets
                if (twt.text != '') {
                    //Tweet Object to be stored in the db
                    let twitObj = {
                        // date: twt.created_at,
                        text: dataPrep(twt.text),
                        textHuman: twt.text.replace('RT', ''),
                        location: locationFilter(twt.user.location),
                    };
                    //Save the object into the db
                    new tweetDB(twitObj)
                        .save()
                        // .then(() => dblog.info('Data saved!'))
                        .catch(err => dblog.error(err));
                }

            }
        });

        //Monitoring
        let counter = 0;
        let dbStats = 0;
        changeStream.on('change', () => {
            dbStats = counter = counter + 1;
        });

        // Return Stats every 10 sec	
        setInterval(() => {
            dblog.info('Tweet Analyzed Since Started: ' + dbStats);
        }, 10 * 1000);

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