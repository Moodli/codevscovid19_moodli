// Dependencies
const fs = require('fs');
const Twit = require('twit');

// Custom modules
const { dataTransfer, } = require('./textProcessors/workerRelay');

// Load socket io
require('./socketio');

// Redis
const { setAsync, } = require('./database/redisConnection');

// Extract env vars
const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET, NODE_ENV, } = process.env;

// Winston Logger
const dbLog = require('./system/logs').get('dbCon');

// Twit creds
let creds = {};

if (NODE_ENV === 'production') {
    creds = {
        'consumer_key': CONSUMER_KEY,
        'consumer_secret': CONSUMER_SECRET,
        'access_token': ACCESS_TOKEN,
        'access_token_secret': ACCESS_TOKEN_SECRET,
        'timeout_ms': 60 * 1000,
        'strictSSL': true,
    };
} else {

    // eslint-disable-next-line global-require
    creds = require('../creds/tweetapiKey.js');
}


// Load the sample dataset
setAsync('sample_dataset', fs.readFileSync('./productionData/sampledataset.json'))
    .then(() => dbLog.info('Dataset loaded'))
    .catch(err => dbLog.error(err));

// Create a new Twitter crawler instance
const T = new Twit(creds);


// Create a readable stream 
const stream = T.stream('statuses/filter', { track: ['covid19', 'coronavirus', 'CoronaVirusUpdates', 'COVIDー19', 'QuarantineLife', 'Quarantine', 'lockdown', 'self-isolate', 'social-distancing', 'masks', 'face masks', 'face mask', 'covid-19', 'covid', 'Vaccine', 'vaccine'], language: 'en', });

// Send tweet stream to the datatransfer function
stream.on('tweet', (twt) => {
    dataTransfer(twt);
});


