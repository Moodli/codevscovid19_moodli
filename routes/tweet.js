
'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();
const Twit = require('twit')

//Gloabl variables
const creds = require('../creds/tweetapiKey');

//Custom Modules
const dbConnection = require('../config/dbConnection').DB_Connection;
const dataPrep = require('../config/textProcess.js').dataPrep;
const locationFilter = require('../config/textProcess').locationFilter;

//Winston Logger
const logger = require('../config/logs');
const dblog = logger.get('dbCon');

//Load Model for tweetDB
require('../schema/tweetSchema');
const tweetDB = dbConnection.model('tweet');

//Create a new Twitter crawler instance
const T = new Twit(creds);

//Create a stream with specified keywords
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'] })

//Initialize DB Connection
dbConnection
    .once('open', () => {
        dblog.info('DB Connected')

        //Tweet Stream On
        stream.on('tweet', (twt) => {

            //Get rid of all the undef
            if ((locationFilter(twt.user.location)) != 'fup') {

                //Tweet Object to be stored in the db
                let twitObj = {
                    date: twt.created_at,
                    text: dataPrep(twt.text),
                    location: locationFilter(twt.user.location)
                }

                //Save the object into the db
                new tweetDB(twitObj)
                    .save()
                    .then(() => dblog.info('Data saved!'))
                    .catch(err => dblog.error(err))
            }
        })
    })
    .catch(err => dblog.error('Error Connecting to DB' + ' ' + err));





//Export the Module
module.exports = router;
