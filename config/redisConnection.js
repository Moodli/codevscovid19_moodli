// Dependencies
const redis = require('redis');

// Winston Logger
const dbLog = require('./logs').get('dbCon');

//Connect to Redis
const client = redis.createClient({
    host: '127.0.0.1',
    port: '6379',
    password: process.env.Redis_Pass,
})
    .once('connect', () => dbLog.info('Redis Connected'))
    .on('error', err => dbLog.error('Redis Connection Error: ' + err));


//Export the Module
module.exports = { client, };