
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

T.get('search/tweets', { q: 'covid19 since:2020-03-11', count: 100 }, function (err, data, response) {
    console.log(data.statuses)
})

T.stream


//Export the Module
module.exports = router;