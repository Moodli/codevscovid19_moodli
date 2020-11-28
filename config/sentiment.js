// Dependencies
const { exec, } = require('child_process');

// Winston Logger
const logger = require('./logs');
const MLlog = logger.get('MLlog');

const sentimentProccess = () => {


    // ML child process
    const mlOutput = exec('python3 ./mlModel/sentiment_model_english.py', (error, stdout) => {
        if (error) {
            MLlog.error(error.stack);
            MLlog.error('ML Error code: ' + error.code);
            MLlog.error('ML Signal received: ' + error.signal);
        }
        MLlog.debug('ML Child Process STDOUT: ' + stdout);
    });

    mlOutput.on('exit', (code) => {
        MLlog.debug('ML Child process exited with exit code ' + code);
    });

};

// Function for clearing the CSV file
const csvResetProccess = () => {

    // ML child process
    const mlOutput = exec('echo -n "text,location,textHuman" > ./mlModel/tweets.csv', (error) => {
        if (error) {
            MLlog.error(error.stack);
            MLlog.error('ML Error code: ' + error.code);
            MLlog.error('ML Signal received: ' + error.signal);
        }
    });

    mlOutput.on('exit', (code) => {
        MLlog.debug('CSV File Cleared' + code);
    });

};

module.exports = { sentimentProccess, csvResetProccess, };
