
'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();
const Twit = require('twit')
const { Transform } = require("json2csv");
const { Readable } = require('stream');
const { createWriteStream } = require('fs');
const fs = require('fs')

//Gloabl variables
const creds = require('../creds/tweetapiKey');

//Custom Modules
// const dbConnection = require('../config/dbConnection').DB_Connection;
const dataPrep = require('../config/textProcess.js').dataPrep;
const locationFilter = require('../config/textProcess').locationFilter;

//Winston Logger
// const logger = require('../config/logs');
// const dblog = logger.get('dbCon');

//Create a new Twitter crawler instance
const T = new Twit(creds);

const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'] })

//Initialize DB Connection
// dbConnection
//     .once('open', () => {
//         dblog.info('DB Connected')
//         //Load Model for tweetDB
//         require('../schema/tweetSchema');
//         const tweetDB = dbConnection.model('tweet');
//         //MongoDB Change Stream
//         const changeStream = tweetDB.watch()
//         //Tweet Stream On
//         stream.on('tweet', (twt) => {

//             //Get rid of all the undef
//             if ((locationFilter(twt.user.location)) != 'fup') {

//                 //Tweet Object to be stored in the db
//                 //Tweet Object to be stored in the db
//                 let twitObj = {
//                     date: twt.created_at,
//                     text: dataPrep(twt.text),
//                     textHuman: twt.text.replace('RT', ''),
//                     location: locationFilter(twt.user.location)
//                 }
//                 //Save the object into the db
//                 new tweetDB(twitObj)
//                     .save()
//                     // .then(() => dblog.info('Data saved!'))
//                     .catch(err => dblog.error(err))
//             }
//         })

//         //Monitoring
//         let counter = 0
//         changeStream.on('change', (change) => {
//             dblog.info(change.operationType + " " + `${counter = counter + 1}`)
//         })
//     })
//     .catch(err => dblog.error('Error Connecting to DB' + ' ' + err));


//CSv
//Tweet Stream On
const fufu = () => {
    stream.on('tweet', (twt) => {

        //Get rid of all the undef
        if ((locationFilter(twt.user.location)) != 'fup') {

            //Tweet Object to be stored in the db
            let twitObj = {
                date: twt.created_at,
                text: dataPrep(twt.text),
                textHuman: twt.text.replace('RT', ''),
                location: locationFilter(twt.user.location)
            }
            //console.log(twitObj)

            //Pipie the tweets into the object
            input.push(twitObj)
        }
    })

    //Define Write input and output
    const output = createWriteStream(`./productionData/tweet.csv`, { encoding: 'utf8' });
    const input = new Readable({ objectMode: true });
    //Headers
    const fields = ['date', 'text', 'textHuman', 'location'];
    const opts = { fields };
    //We are taking data in as an object
    const transformOpts = { objectMode: true };
    const json2csv = new Transform(opts, transformOpts);
    //Pipe the data to the output
    input._read = () => { };
    input.pipe(json2csv).pipe(output)

    setInterval(() => {
        input.pause()
    }, 5 * 1000);
}
fufu()



//Export the Module
module.exports = router;

    // //End the write stream on exit
    // process.on('exit', () => {
    //     input.push(null)
    // });