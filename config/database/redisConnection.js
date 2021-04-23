// Dependencies
const redis = require('redis');

// Winston Logger
const dbLog = require('../system/logs').get('dbCon');

//Connect to Redis
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: 6379,
})
    .once('connect', () => dbLog.info('Redis Connected'))
    .on('error', err => dbLog.error('Redis Connection Error: ' + err));

// Promisify redis query
const { promisify, } = require('util');
const setAsync = promisify(redisClient.SET).bind(redisClient);
const getAsync = promisify(redisClient.GET).bind(redisClient);
const lpushAsync = promisify(redisClient.LPUSH).bind(redisClient);
const rpopAsync = promisify(redisClient.RPOP).bind(redisClient);
const appendAsync = promisify(redisClient.APPEND).bind(redisClient);

// Export the Module
module.exports = { setAsync, getAsync, lpushAsync, rpopAsync, appendAsync, };
