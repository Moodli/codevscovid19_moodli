'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();
const axios = require('axios');

//Global Variables
const creds = require('../creds/tweetapiKey');
const tweetKey = `${creds.consumer_key}:${creds.consumer_secret}`;
const credentialsBase64Encoded = Buffer.from(tweetKey).toString('base64');

//GET Routes
router.get('/hello', (req, res) => {
    res.json({
        status: 'Alles Gut!',
        greeting: 'Hello World!'
    })
});


//Get token body
let getToken = {
    method: 'post',
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
        'Authorization': `Basic ${credentialsBase64Encoded}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: 'grant_type=client_credentials'
};

//Requst
// axios(getToken)
//     .then(rs => {
//         console.log(rs.data.access_token)
//         let reqBd = {
//             method: 'post',
//             url: 'https://api.twitter.com/1.1/tweets/search/30day/dev.json',
//             // url: 'https://api.twitter.com/1.1/tweets/search/fullarchive/dev.json',
//             headers: {
//                 'Authorization': `Bearer ${rs.data.access_token}`,
//                 'Content-Type': 'application/json'
//             },
//             data: {
//                 'query': '#covid19 has:geo',
//                 'maxResults': '100',
//                 'fromDate': '202002262106',
//                 'toDate': '202003242107'
//             }
//         }

//         axios(reqBd)
//             .then(rs => console.log(rs.data.results.length))
//             .catch(err => console.log(err.toJSON()))

//     })
//     .catch(err => console.log(err.toJSON()))


//Export the Module
module.exports = router;


//                 // curl --request POST \
//                 // --url https://api.twitter.com/1.1/tweets/search/30day/dev.json \
//                 // --header 'authorization: Bearer AAAAAAAAAAAAAAAAAAAAAN4pDQEAAAAAoTKng4yu2wwwD%2BR%2BGvrQx5xLk9k%3DhIwe96FjdUaEsmvAhDaQzOeFK5HwSXVfBfnW4K6Ab4Hl5ZzAhQ' \
//                 // --header 'content-type: application/json' \
//                 // --data '{
//                 //               "query":"from:TwitterDev lang:en",
//                 //               "maxResults": "100",
//                 //               "fromDate":"202003012106", 
//                 //               "toDate":"202003242107"
//                 //               }'