// Dependencies
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Worker, } = require('worker_threads');

// Worker pool
const { workerPool, } = require('./pool');


// Write Stream Parameters
const csvLocation = path.join(__dirname, '../../mlModel/tweets.csv');
const writeSt = fs.createWriteStream(csvLocation, { flags: 'a', });

// Redis
const { setAsync, rpopAsync, } = require('../database/redisConnection');


// Create a map to hold the workers
const totalWorkers = new Map();

// Get the no. of cpu cores of the system
const cpuCores = os.cpus();

// Create a worker per cpu core
cpuCores.forEach(() => {

    // Create a new worker
    const worker = new Worker(`${__dirname}/textProcessWorker.js`);


    // Extract the threadId
    const { threadId, } = worker;


    // Add the worker to the map
    totalWorkers.set(threadId, worker);
});

// Create a new worker pool
const nwp = new workerPool(totalWorkers);

const dispatcher = async () => {


    const data = await rpopAsync('twt');
    const parsedData = JSON.parse(data);
    /**
    * Assign the task to the worker
    */
    const tasks = nwp.assignTask(parsedData);

    /**
    * Wait for the promises in the back log to resolve one by one
    * while removing them from the back log   
    */
    const result = await Promise.all(
        tasks.map(async (task) => {

            // Wait for the task to resolved 
            return await task;
        })
    );
    // Write to the file
    await setAsync('csv', result[0]);
};

module.exports = { dispatcher, };