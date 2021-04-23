// Dependencies
const util = require('util');

// Pmoisify execFile
const execFile = util.promisify(require('child_process').execFile);

// Redis
const { delAsync, setAsync,} = require('../database/redisConnection');

// Winston Logger
const MLlog = require('../system/logs').get('MLlog');

/**
 * The child process that calls the python model
 * @returns {Promise<Undefined>}
 */
const sentimentProccess = async () => {

    try {

        // The command and its args to pass into execFile
        const command = 'python3';
        const args = ['./mlModel/sentiment_model_english.py'];

        // Exract stdout
        const { stdout, } = await execFile(command, args);

        MLlog.debug(stdout);

    } catch (err) {
        MLlog.error(err);
    }

};

/**
 * Function for clearing the CSV file
 * @returns {Promise<undefined>}
 */
const ResetProccess = async () => {

    try {

        // Clear the twt key in redis
        await delAsync('twt');

        // Clear the csv key in redis
        await delAsync('csv');

// Rewrite the CSV column name
await setAsync('csv', `${'\n'}text,location,textHuman`);

    } catch (err) {

        MLlog.error(err);
    }
};

module.exports = { sentimentProccess, ResetProccess, };
