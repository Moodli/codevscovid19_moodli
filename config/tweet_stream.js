// Dependencies
const { readFileSync, } = require('fs');
const path = require('path');
const Twit = require('twit');
const { dispatcher, } = require('./worker/dispatcher');

// Load socket io
require('./socketio');

// Redis
const { setAsync, lpushAsync, } = require('./database/redisConnection');

// Extract env vars
const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET, } = process.env;

// Winston Logger
const dbLog = require('./system/logs').get('dbCon');

// Twit creds
const creds = {
    'consumer_key': CONSUMER_KEY,
    'consumer_secret': CONSUMER_SECRET,
    'access_token': ACCESS_TOKEN,
    'access_token_secret': ACCESS_TOKEN_SECRET,
    'timeout_ms': 60 * 1000,
    'strictSSL': true,
};


// Load the sample dataset
const dataSetPath = path.join(__dirname, '../productionData/sampledataset.json');
setAsync('sample_dataset', readFileSync(dataSetPath))
    .then(() => dbLog.info('Dataset loaded'))
    .catch(err => dbLog.error(err));

// Create a new Twitter crawler instance
const T = new Twit(creds);

// Create a readable stream 
const stream = T.stream('statuses/filter', {
    track:
        ['covid19', 'coronavirus', 'CoronaVirusUpdates',
            'COVIDー19', 'QuarantineLife', 'Quarantine',
            'lockdown', 'self-isolate', 'social-distancing',
            'masks', 'face masks', 'face mask',
            'covid-19', 'covid', 'Vaccine', 'vaccine'],
    language: 'en',
});



// Send tweet stream to the datatransfer function
stream.on('tweet', async (twt) => {

    // Push the incoming tweets into redis
    const stringified = JSON.stringify(twt);
    await lpushAsync('twt', stringified);
    await dispatcher();
});


