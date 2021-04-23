// Dependencies
const os = require('os');
const { Worker, } = require('worker_threads');

// Worker pool
const { workerPool, } = require('./pool');

// Redis
const { rpopAsync, appendAsync, } = require('../database/redisConnection');

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

    // Get the raw tweets from redis
    const data = await rpopAsync('twt');
    const parsedData = JSON.parse(data);


    // Don't assign tasks when there is no available workers
    if (nwp.availableWorkers === 0) {
        return;
    }

    /**
    * Assign the task to workers
    */
    const tasks = nwp.assignTask(parsedData);

    /**
    * Wait for the promises in the back log to resolve one by one
    * while removing them from the back log   
    */
    const result = await Promise.all(
        tasks.map(async (task) => {

            // Wait for the task to resolved 
            const resolved = await task;

            // Remove the tasks from the back log
            nwp.release();

            // Return the processed task
            return resolved;
        })
    );

    // Write to redis
    await appendAsync('csv', result[0]);
};

module.exports = { dispatcher, };