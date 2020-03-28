
'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();
const Twit = require('twit')

//Gloabl variables
const creds = require('../creds/tweetapiKey');

//Create a new Twitter crawler instancec
const T = new Twit(creds);
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus'], language: 'en' })

// stream.on('message', (msg) => {
//     console.log(msg)
// })

stream.on('tweet', (twt) => {
    // console.log(twt.created_at)
    // console.log(twt.text)
    // console.log(twt.lang)
    // console.log(twt.user.location)
    console.log(twt)
})
// T.get('search/tweets', { q: 'covid19', count: 1000 }, function (err, data, response) {
//     console.log(data.statuses.length)
// })


//test

//Export the Module
module.exports = router;

//test
//test