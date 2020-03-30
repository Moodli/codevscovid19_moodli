'use strict';
/*eslint-env node*/

//Dependencies
const { exec } = require('child_process');

//Custom Modules
const dbConnection = require('../config/dbConnection').DB_Connection;
require('../schema/tweetSchema');
const tweetDB = dbConnection.model('tweet');

//Winston Logger
const logger = require('./logs');
const subprocessLog = logger.get('subprocessLog');


//Define the spawn function
const childSpawn = () => {
    // MongoDB dump child process
    tweetDB.countDocuments()
        .then(count => {
            const mongoDump = exec(`mongoexport --host Cluster0-shard-0/cluster0-shard-00-00-osoe0.mongodb.net:27017,cluster0-shard-00-01-osoe0.mongodb.net:27017,cluster0-shard-00-02-osoe0.mongodb.net:27017 --ssl --username moodliDB --password f524wCGWkn3BhKhz --authenticationDatabase admin --db Moodli --collection Tweets --type csv --fields text,location,textHuman --limit 1000 --skip ${count - 1000} --out ./mlModel/tweets.csv
    `, (error, stdout, stderr) => {
                if (error) {
                    subprocessLog.info(error.stack);
                    subprocessLog.info('Child MONGO Error code: ' + error.code);
                    subprocessLog.info('Child MONGO Signal received: ' + error.signal);
                }
                // subprocessLog.info('Child MONGO Process STDOUT: ' + stdout);
                // subprocessLog.info('Child MONGO Process STDERR: ' + stderr);


            });

            mongoDump.on('exit', (code) => {
                subprocessLog.info('MONGO Child process exited with exit code ' + code);

                if (code === 0) {
                    //ML child process
                    const mlOutput = exec(`python3 ./mlModel/sentiment_model_english.py`, (error, stdout, stderr) => {
                        if (error) {
                            subprocessLog.info(error.stack);
                            subprocessLog.info('ML Error code: ' + error.code);
                            subprocessLog.info('ML Signal received: ' + error.signal);
                        }
                        subprocessLog.info('ML Child Process STDOUT: ' + stdout);
                        subprocessLog.info('ML Child Process STDERR: ' + stderr);
                    });

                    mlOutput.on('exit', (code) => {
                        subprocessLog.info('ML Child process exited with exit code ' + code);
                    });
                }


            });


        })

};

module.exports = { childSpawn }

// const shell = require('shelljs')
// shell.exec('../mongodump/tweetDump.sh')