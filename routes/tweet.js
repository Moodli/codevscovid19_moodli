
'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();
const fs = require('fs');
const Twit = require('twit')

//Gloabl variables
const creds = require('../creds/tweetapiKey');
const productionData = require('../productionData/dataset.json')

//Custom Modules
const dataPrep = require('../config/textProcess.js').dataPrep;
const locationFilter = require('../config/textProcess').locationFilter;
const dbConnection = require('../config/dbConnection').DB_Connection;
const cacheMiddleware = require('../config/meCache').cacheMiddleware;

//Create a new Twitter crawler instance
const T = new Twit(creds);

const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'] })

//Winston Logger
const logger = require('../config/logs');
const dblog = logger.get('dbCon');

//Initialize DB Connection
dbConnection
    .once('open', () => {
        dblog.info('DB Connected')
        //Load Model for tweetDB
        require('../schema/tweetSchema');
        const tweetDB = dbConnection.model('tweet');

        //MongoDB Change Stream
        const changeStream = tweetDB.watch()
        //Tweet Stream On
        stream.on('tweet', (twt) => {

            //Get rid of all the undef
            if ((locationFilter(twt.user.location)) != 'fup') {

                //Tweet Object to be stored in the db
                let twitObj = {
                    // date: twt.created_at,
                    text: dataPrep(twt.text),
                    textHuman: twt.text.replace('RT', ''),
                    location: locationFilter(twt.user.location)
                }
                //Save the object into the db
                new tweetDB(twitObj)
                    .save()
                    // .then(() => dblog.info('Data saved!'))
                    .catch(err => dblog.error(err))
            }
        })

        //Monitoring
        let counter = 0;
        let dbStats = 0;
        changeStream.on('change', (change) => {
            dbStats = counter = counter + 1;
        })

    })
    .catch(err => dblog.error('Error Connecting to DB' + ' ' + err));


//API send geoJson [2min cache duration]
router.get('/geo', (req, res) => {
    // res.json(productionData)
    res.send(JSON.stringify(productionData))
});

// //Tweet raw flow monitoring:3000 constant
// let count = [];
// stream.on('tweet', (twt) => {
//     count.push(twt.created_at)
// });

// setTimeout(() => {
//     console.log(count.length)
// }, 60000)


//Export the Module
module.exports = router;

// //End the write stream on exit
// process.on('exit', () => {
//     input.push(null)
// });

// dbStats = change.operationType + " " + `${counter = counter + 1}`;