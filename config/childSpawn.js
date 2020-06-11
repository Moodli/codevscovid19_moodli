
/*eslint-env node*/

//Dependencies
const { exec, } = require('child_process');
const fs = require('fs');
const md5File = require('md5-file');

//DB Connection
const dbConnection = require('../config/dbConnection').DB_Connection;
require('../schema/tweetSchema');
const tweetDB = dbConnection.model('tweet');

//Winston Logger
const logger = require('./logs');
const subprocessLog = logger.get('subprocessLog');

//Determine the Mongoexport parameters
const exportParameters = (exportCb) => {
    //Count the document in the DB
    tweetDB.estimatedDocumentCount()
        .then(count => {
            if (count <= 8000) {
                exportCb('mongoexport --host Cluster0-shard-0/cluster0-shard-00-00-osoe0.mongodb.net:27017,cluster0-shard-00-01-osoe0.mongodb.net:27017,cluster0-shard-00-02-osoe0.mongodb.net:27017 --ssl --username moodliDBread --password ilaHtxZYN6rALqtd --authenticationDatabase admin --db Moodli --collection Tweets --type csv --fields text,location,textHuman --out ./mlModel/tweets.csv');
                //You think you found something here again? It's a readonly user my friend.
            } else {
                exportCb(`mongoexport --host Cluster0-shard-0/cluster0-shard-00-00-osoe0.mongodb.net:27017,cluster0-shard-00-01-osoe0.mongodb.net:27017,cluster0-shard-00-02-osoe0.mongodb.net:27017 --ssl --username moodliDBread --password ilaHtxZYN6rALqtd --authenticationDatabase admin --db Moodli --collection Tweets --type csv --fields text,location,textHuman --limit 20000 --skip ${count - 20000} --out ./mlModel/tweets.csv`);
            }
        })
        .catch(err => subprocessLog.error('Error Getting MongoDump Parameters: ' + err));
};

//Define the spawn function
const childSpawn = () => {
    //Get the export parameters
    exportParameters(exportCb => {
        // MongoDB dump child process
        const mongoDump = exec(exportCb, (error) => {
            if (error) {
                subprocessLog.info(error.stack);
                subprocessLog.info('Child MONGO Error code: ' + error.code);
                subprocessLog.info('Child MONGO Signal received: ' + error.signal);
            }
            subprocessLog.info('Child MONGO Process STDOUT: ' + stdout);
            // subprocessLog.info('Child MONGO Process STDERR: ' + stderr);
        });

        mongoDump.on('exit', (code) => {
            subprocessLog.info('MONGO Child process exited with exit code ' + code);

            if (code === 0) {
                //ML child process
                const mlOutput = exec('python3 ./mlModel/sentiment_model_english.py', (error, stdout) => {
                    if (error) {
                        subprocessLog.info(error.stack);
                        subprocessLog.info('ML Error code: ' + error.code);
                        subprocessLog.info('ML Signal received: ' + error.signal);
                    }
                    subprocessLog.info('ML Child Process STDOUT: ' + stdout);
                    // subprocessLog.info('ML Child Process STDERR: ' + stderr);
                });

                mlOutput.on('exit', (code) => {
                    subprocessLog.info('ML Child process exited with exit code ' + code);

                    //Log file checksum
                    subprocessLog.info('File checksum: ' + md5File.sync('./productionData/dataset.json'));

                });
            }

        });
    });

};

<<<<<<< HEAD
const childSpawn3 = () => {


    //ML child process
    const mlOutput = exec('python3 ./mlModel/sentiment_model_english.py', (error, stdout) => {
        if (error) {
            subprocessLog.info(error.stack);
            subprocessLog.info('ML Error code: ' + error.code);
            subprocessLog.info('ML Signal received: ' + error.signal);
        }
        subprocessLog.info('ML Child Process STDOUT: ' + stdout);
        // subprocessLog.info('ML Child Process STDERR: ' + stderr);
    });

    mlOutput.on('exit', (code) => {
        subprocessLog.info('ML Child process exited with exit code ' + code);
        //Log file checksum
        subprocessLog.info('MD5: ' + md5File.sync('./productionData/dataset.json'));
    });

};

module.exports = { childSpawn, childSpawn1, childSpawn3, };
=======
exportParameters(cb=>console.log(cb))

module.exports = { childSpawn};
>>>>>>> master

// const shell = require('shelljs')
// shell.exec('../mongodump/tweetDump.sh')
