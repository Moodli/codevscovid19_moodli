
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

//Load Model for tweetDB
require('../schema/tweetSchema');
const tweetDB = dbConnection.model('tweet');

//Create a new Twitter crawler instancec
const T = new Twit(creds);
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus'], language: 'en' })


//Tweet Stream On
stream.on('tweet', (twt) => {
    //Tweet Object to be stored in the db
    let twitObg = {
        date: twt.created_at,
        text: twt.text,
        location: twt.user.location
    }

    //Save the object into the db
    new tweetDB(twitObg)
        .save()
        .then(rs => console.log(rs))
})



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
