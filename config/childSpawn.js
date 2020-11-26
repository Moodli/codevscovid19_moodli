// Dependencies
const { exec, } = require('child_process');
const md5File = require('md5-file');

// Winston Logger
const logger = require('./logs');
const subprocessLog = logger.get('subprocessLog');

const childSpawn3 = () => {


    // ML child process
    const mlOutput = exec('python3 ./mlModel/sentiment_model_english.py', (error, stdout) => {
        if (error) {
            subprocessLog.error(error.stack);
            subprocessLog.error('ML Error code: ' + error.code);
            subprocessLog.error('ML Signal received: ' + error.signal);
        }
        subprocessLog.debug('ML Child Process STDOUT: ' + stdout);
        //  subprocessLog.info('ML Child Process STDERR: ' + stderr);
    });

    mlOutput.on('exit', (code) => {
        subprocessLog.debug('ML Child process exited with exit code ' + code);
        // Log file checksum
        subprocessLog.info('MD5: ' + md5File.sync('./productionData/dataset.json'));
    });

};

module.exports = { childSpawn, childSpawn1, childSpawn3, };
