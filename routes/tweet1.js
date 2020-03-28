
'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const router = express.Router();
//Gloabl variables
const creds = require('../creds/tweetapiKey');

const TwitterClient = require('twit-wrapper');
const twitterClient = new TwitterClient(
    creds.consumer_key,
    creds.consumer_secret,
    creds.access_token,
    creds.access_token_secret,
);

// post new tweet
// try {
//   const msgToPost = 'Post a test message';
//   const postedMsg = await twitterClient.postTweet(msgToPost);
//   console.log(postedMsg);
// } catch (e) {
//   console.error(e);
// }

// search twitter for all tweets containing the word 'javascript' since January 1, 2017

// twitterClient.getTweets('covid19', '2017-01-01')
//     .then(rs => console.log(rs))



//Export the Module
module.exports = router;