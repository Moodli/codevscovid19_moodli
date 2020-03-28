
'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();
const Twit = require('twit')
const cL = require('country-list');

//Gloabl variables
const creds = require('../creds/tweetapiKey');

//Custom Modules
const dbConnection = require('../config/dbConnection').DB_Connection;
const dataPrep = require('../config/textProcess.js').dataPrep

//Load Model for tweetDB
require('../schema/tweetSchema');
const tweetDB = dbConnection.model('tweet');

//Create a new Twitter crawler instancec
const T = new Twit(creds);
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuaratineLife', 'Quaratine', 'lockdown', 'self-isolate', 'social-distancing'] })
const cities = require('all-the-cities');
// console.log(cities.filter(city => {
//     city.name.match('Amsterdam') && city.country.match('NL')
// }));
//Tweet Stream On
// stream.on('tweet', (twt) => {
// if(twt.user.location!=null){
//         //Tweet Object to be stored in the db
//         let twitObj = {
//             date: twt.created_at,
//             text: dataPrep(twt.text),
//             location: twt.user.location
//         }
//     console.log(twitObj.location)
//         // //Save the object into the db
//         //  new tweetDB(twitObj)
//         //     .save()
//         //      .then(rs => console.log(rs))
// }
// })

// Tweet Stream On
// stream.on('tweet',(twt)=>{
// if(twt.user.location!=null){
//     // console.log(twt.user.location.split(","))
//  console.log(twt.user.location)
// }
// })

// console.log(cL.getCode('Perú'));

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