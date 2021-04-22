// Worker
const { Worker, } = require('worker_threads');

// Text Processing Workers
const workerText = new Worker(`${__dirname}/textProcessWorker.js`);
const workerText1 = new Worker(`${__dirname}/textProcessWorker.js`);
const workerText2 = new Worker(`${__dirname}/textProcessWorker.js`);
const workerText3 = new Worker(`${__dirname}/textProcessWorker.js`);

// The worker pool
const workerPool = [workerText, workerText1, workerText2, workerText3];
// const workerPool = [workerText, workerText1];

// CSV Workers
const workerCSV = new Worker(`${__dirname}/csvGen.js`);
const workerCSV1 = new Worker(`${__dirname}/csvGen.js`);
const workerCSV2 = new Worker(`${__dirname}/csvGen.js`);
const workerCSV3 = new Worker(`${__dirname}/csvGen.js`);

// Generate a number that corresponds to each index of the array. repeat.
// Worker Rotation Function
let i = -1;
const inc = (n, poolName) => {
    if (n < poolName.length - 1) {
        n += 1;
        return n;
    }
    return 0;
};


// Winston Loggers
const statsLog = require('../system/logs').get('statsLog');


// Initialize Porcessing Coverage Counter
let inp = 0;
let out = 0;

// Data transfer function
const dataTransfer = (twt) => {

    // Increase the output counter
    inp += 1;

    // Send raw tweets to the workers
    workerPool[inc(i, workerPool)].postMessage(twt);
    i = inc(i, workerPool);
};

// Listening for messages from the worker
workerText.on('message', twitObj => {

    // Increase the output counter
    out += 1;

    // Send raw tweets to the CSV workers
    workerCSV.postMessage(twitObj);
});

// Listening for messages from the worker1
workerText1.on('message', twitObj => {

    // Increase the output counter
    out += 1;

    // Send raw tweets to the CSV workers
    workerCSV1.postMessage(twitObj);
});

workerText2.on('message', twitObj => {

    // Increase the output counter
    out += 1;

    // Send raw tweets to the CSV workers
    workerCSV2.postMessage(twitObj);
});

workerText3.on('message', twitObj => {

    // Increase the output counter
    out += 1;

    // Send raw tweets to the CSV workers
    workerCSV3.postMessage(twitObj);
});

// Porcessing Coverage Counter
setInterval(() => {
    statsLog.debug(`In: ${inp} | Out: ${out}`);
}, 600 * 100);


module.exports = { dataTransfer, };

