// Dependencies
const util = require('util');

// Pmoisify execFile
const execFile = util.promisify(require('child_process').execFile);

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
const csvResetProccess = async () => {

    try {
        // The command to pass into execFile
        const command = 'echo -n "text,location,textHuman" > ./mlModel/tweets.csv';

        // Run execFile with the shell option set to true so the command in executed using sh
        await execFile(command, { shell: true, });

        MLlog.debug('CSV File Cleared');

    } catch (err) {

        MLlog.error(err);
    }
};

module.exports = { sentimentProccess, csvResetProccess, };
