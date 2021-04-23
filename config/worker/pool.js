/**
 * workerPool Implementation
 */
class workerPool {

    /**
   * Create a new error object
   * @param {Map} totalWorkers - A map of all workers
   */
    constructor(totalWorkers) {

        // A map of all workers
        this.totalWorkers = totalWorkers;

        // Available workers (the keys from the totalWorkers map)
        this.availableWorkers = [...this.totalWorkers.keys()];

        // Array to hold busy workers
        this.busyWorkers = [];

        // The back log array for holding task
        this.backLog = [];

    }

    /**
     * Assign the task to workers
     * @param {Array<String>} task - The task to send to the workers
     * @returns {Array<Promise>} An array of promises of unresolved tasks
     */
    assignTask(task) {

        // Only assign new tasks when there are available workers 
        if (this.availableWorkers.length !== 0) {

            // Remove from the beginning of the availableWorkers array
            const assignedWorkerId = this.availableWorkers.shift();
            // Push the worker to the busyWorkers array
            this.busyWorkers.push(assignedWorkerId);

            // Get the worker from the map and send the task to the worker thread
            this.totalWorkers.get(assignedWorkerId).postMessage(task);
            // Push the tasks to the backlog 
            this.backLog.push(new Promise((resolve, reject) => {

                // Find the index of the worker in the busyWorkers array
                const releasedWorker = this.busyWorkers.indexOf(assignedWorkerId);
                // Remove the worker from the busyWorkers array
                const releasedWorkerId = this.busyWorkers.splice(releasedWorker, 1)[0];
                // Move the worker back to the availableWorkers array
                this.availableWorkers.push(releasedWorkerId);
                // Wait for the response from the worker thread
                this.totalWorkers.get(assignedWorkerId).on('message', resolve);
                // Check for error
                this.totalWorkers.get(assignedWorkerId).on('merror', reject);

            }));

            // Return the back log
            return this.backLog;
        }


        // Return the back log
        return this.backLog;

    }

    /**
     * Remove the task from the back log
     * @returns {Udefined}
     */
    release() {
        if (this.backLog.length !== 0) {
            this.backLog.shift();
        }
    }

    /**
     * Get current available workers
     * @returns {Number}
     */
    getWorkers() {
        return this.availableWorkers;
    }
}

module.exports = { workerPool, };
