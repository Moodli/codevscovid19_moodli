
// const shell = require('shelljs')
// shell.exec('../mongodump/tweetDump.sh')

const childSpawn = () => {

    const { exec } = require('child_process');

    const mongoDump = exec(`mongoexport --host Cluster0-shard-0/cluster0-shard-00-00-osoe0.mongodb.net:27017,cluster0-shard-00-01-osoe0.mongodb.net:27017,cluster0-shard-00-02-osoe0.mongodb.net:27017 --ssl --username moodliDB --password f524wCGWkn3BhKhz --authenticationDatabase admin --db Moodli --collection Tweets --type csv --fields text,location,date,textHuman --out ../mlModel/tweets.csv
`, (error, stdout, stderr) => {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('Child Process STDOUT: ' + stdout);
        console.log('Child Process STDERR: ' + stderr);
    });

    mongoDump.on('exit', function (code) {
        console.log('Child process exited with exit code ' + code);
    });
}


module.exports = { childSpawn }