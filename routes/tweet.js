
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

//Load Model for tweetDB
require('../schema/tweetSchema');
const tweetDB = dbConnection.model('tweet');

//Create a new Twitter crawler instance
const T = new Twit(creds);

//Create a stream with specified keywords
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'] })

// console.log(cities.filter(city => city.name.match('Amsterdam') && city.country.match('NL'))[0])

// console.log(('Tasd England').match(/[^ ,]+/g).join(',').split(','))
//Tweet Stream On
// stream.on('tweet', (twt) => {

//     if ((locationFilter(twt.user.location)) != 'fup') {
//         //Tweet Object to be stored in the db
//         let twitObj = {
//             date: twt.created_at,
//             text: dataPrep(twt.text),
//             location: locationFilter(twt.user.location)
//         }
//         console.log(twitObj)
//         //Save the object into the db
//         new tweetDB(twitObj)
//             .save()
//             .then()
//     }



// })

// Tweet Stream On
// try {
//     stream.on('tweet', (twt) => {

//         if ((locationFilter(twt.user.location)) != 'fup') {
//             console.log(locationFilter(twt.user.location))
//         }
//     })

// } catch (error) {
//     console.log(error)
// }


//Export the Module
module.exports = router;



// T.get('search/tweets', { q: 'covid19', count: 1000 }, function (err, data, response) {
//     console.log(data.statuses.length)
// })



// tweetDB.find({})
//     .explain()
//     .then(rs => console.log(rs))

// stream.on('message', (msg) => {
//     console.log(msg)
// })


    // console.log(twt.created_at)
    // console.log(twt.text)
    // console.log(twt.lang)
    // console.log(twt.user.location)
    // console.log(twt)

    // '肺炎','新冠病毒','新冠肺炎','病毒','新型冠状病毒'