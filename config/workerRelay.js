//Worker
const { Worker, } = require('worker_threads');

//Text Processing Workers
const workerText = new Worker(`${__dirname}/textProcessWorker.js`);
const workerText1 = new Worker(`${__dirname}/textProcessWorker.js`);
const workerText2 = new Worker(`${__dirname}/textProcessWorker.js`);
const workerText3 = new Worker(`${__dirname}/textProcessWorker.js`);
const workerPool = [workerText, workerText1, workerText2, workerText3];

//CSV Workers
const workerCSV = new Worker(`${__dirname}/csvGen.js`);
const workerCSV1 = new Worker(`${__dirname}/csvGen.js`);
const workerCSV2 = new Worker(`${__dirname}/csvGen.js`);
const workerCSV3 = new Worker(`${__dirname}/csvGen.js`);
// const csvWorkerPool = [workerCSV, workerCSV1, workerCSV2, workerCSV3];

//Generate a number that corresponds to each index of the array. repeat.
//Worker Rotation Function
let i = -1;
const inc = (n, poolName) => {
    if (n < poolName.length - 1) {
        n += 1;
        return n;
    }
    return 0;
};

//DB Connection
const { DB_Connection: dbConnection, } = require('./dbConnection');
require('../schema/tweetSchema');
const tweetDB = dbConnection.model('tweet');
const changeStream = tweetDB.watch();

//Winston Loggers
const logger = require('./logs');
const dblog = logger.get('dbCon');
const statsLog = logger.get('statsLog');

//Initialize Porcessing Coverage Counter
let inp = 0;
let out = 0;

//Data transfer function
const dataTransfer = (twt) => {

    //Increase the output counter
    inp += 1;

    //Send raw tweets to the workers
    workerPool[inc(i, workerPool)].postMessage(twt);
    i = inc(i, workerPool);
};

//Listening for messages from the worker
workerText.on('message', twitObj => {

    //Increase the output counter
    out += 1;

    //Send raw tweets to the CSV workers
    // csvWorkerPool[inc(i, csvWorkerPool)].postMessage(twitObj);
    // i = inc(i, csvWorkerPool);
    workerCSV.postMessage(twitObj);

    //Save the object into the db
    new tweetDB(twitObj)
        .save()
        .catch(err => dblog.error(err));
});

//Listening for messages from the worker1
workerText1.on('message', twitObj => {

    //Increase the output counter
    out += 1;

    //Send raw tweets to the CSV workers
    // csvWorkerPool[inc(i, csvWorkerPool)].postMessage(twitObj);
    // i = inc(i, csvWorkerPool);
    workerCSV1.postMessage(twitObj);

    //Save the object into the db
    new tweetDB(twitObj)
        .save()
        .catch(err => dblog.error(err));
});

workerText2.on('message', twitObj => {

    //Increase the output counter
    out += 1;

    //Send raw tweets to the CSV workers
    // csvWorkerPool[inc(i, csvWorkerPool)].postMessage(twitObj);
    // i = inc(i, csvWorkerPool);
    workerCSV2.postMessage(twitObj);

    //Save the object into the db
    new tweetDB(twitObj)
        .save()
        .catch(err => dblog.error(err));
});

workerText3.on('message', twitObj => {

    //Increase the output counter
    out += 1;

    //Send raw tweets to the CSV workers
    // csvWorkerPool[inc(i, csvWorkerPool)].postMessage(twitObj);
    // i = inc(i, csvWorkerPool);
    workerCSV3.postMessage(twitObj);

    //Save the object into the db
    new tweetDB(twitObj)
        .save()
        .catch(err => dblog.error(err));
});

//DB Monitoring
let dbStats = 0;
changeStream.on('change', () => {
    dbStats += 1;
});

//Porcessing Coverage Counter
setInterval(() => {
    statsLog.debug(`In: ${inp} | Out: ${out}`);
    statsLog.debug(`Tweet Processed: ${dbStats}`);
}, 600 * 100);


module.exports = { dataTransfer, };

// const csvProcess1 = (twt) => {

//     inp += 1;
//     //Get rid of all the undefs
//     if (locationFilter(twt.user.location)) {
//         out += 1;
//         //Get rid of all the empty tweets
//         if (twt.text) {

//             //Tweet Object to be stored in the db
//             let twitObj = {
//                 // date: twt.created_at,
//                 text: dataPrep(twt.text),
//                 textHuman: twt.text.replace('RT', '').replace('rt', ''),
//                 location: locationFilter(twt.user.location),
//             };

//             csvFunc(twitObj);
//             //Save the object into the db
//             new tweetDB(twitObj)
//                 .save()
//                 .catch(err => dblog.error(err));

//         }
//     }
// };


//Load dictionary file
// const dict = require('../config/dict.js').data;

//BestMatch
// const bestMatch = (array) => {

//     let finalArray = []
//     for (let index = 0; index < array.length; index++) {
//         const element = array[index];
//         const a = strSim.findBestMatch(element, dict)
//         finalArray.push(a.bestMatch.target)
//     }
//     return finalArray
// };



// //Execution time measurement
// let hrstarts = process.hrtime()
// let hrends = process.hrtime(hrstarts)
// simcompLog.info('Execution time[L]: ' + hrends[0] + 's ' + hrends[1] / 1000000 + 'ms')




// var filtered = array.filter((el)=> {
//   return el != null;
// });

// console.log(filtered);

//  //Search locality DB for country[0] and city [1]
//                     //If the result is not undefined return the exact coordinate
//                     if (localtionDB.filter(data => data.country.match(countryCode) && data.name.match(locality[1]))[0] != undefined) {

//                         return [countryCode, locality]
//                         // return [localtionDB.filter(data => data.country.match(countryCode) && data.name.match(locality[1]))[0], locality]
//                         //otherwise just return the country's coordinate
//                     } else {
//                         return [countryCode, locality]
//                         // return [localtionDB.filter(data => data.country.match(countryCode))[0], locality]
//                     }

