

/*eslint-env node*/

//Dependencies
const winston = require('winston');
const path = require('path');

//Global variables
let readableDate = () => {
    return new Date(Date.now()).toUTCString();
};
const logStore = path.join(__dirname, '../logs');

//Custom Log Format
const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true, }),

    winston.format.printf(info => {

        // //Determine Message type => special handling for object and error

        if (!info.stack) {
            return `${readableDate()} | [${info.label}] ${info.level}: ${JSON.stringify(info.message, null, 0)}`;
        }

        return `${info.timestamp} | ${readableDate()} | [${info.label}] ${info.level}: ${info.message} Stack: ${info.stack}`;

    })

);



//Container for Multiple Loggers
const container = new winston.Container();


//Logging Category for dbConnection.js
container.add('dbCon', {
    format: winston.format.combine(
        winston.format.label({ label: 'dbConnection', }),
        logFormat
    ),
    transports: [new winston.transports.Console({ level: 'silly', })],
    exceptionHandlers: [new winston.transports.Console({ level: 'silly', })],
    exitOnError: false,

});

//Logging Category for app.js
container.add('appLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'APP', }),
        logFormat
    ),
    transports: [new winston.transports.Console({ level: 'silly', })],
    exceptionHandlers: [new winston.transports.Console({ level: 'silly', })],
    exitOnError: false,

});

//Logging Category for child process
container.add('subprocessLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'CHILD', }),
        logFormat
    ),
    transports: [
        new winston.transports
            .File({ level: 'error', filename: `${logStore}/subProcess_error.log`, }),
        new winston.transports
            .File({ level: 'info', filename: `${logStore}/subProcess_info.log`, })],

    exceptionHandlers: [
        new winston.transports
            .File({ level: 'silly', filename: `${logStore}/subProcess_exception_combined.log`, })
    ],
    exitOnError: false,

});

//Logging Category for json parsing
container.add('jsonLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'JSON', }),
        logFormat
    ),
    transports: [
        new winston.transports
            .File({ level: 'silly', filename: `${logStore}/json_combined.log`, })
    ],
    exceptionHandlers: [
        new winston.transports
            .File({ level: 'silly', filename: `${logStore}/json_exception_combined.log`, })
    ],
    exitOnError: false,

});


//Logging Category for statistic regarding processing speed
container.add('statsLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'STATS', }),
        logFormat
    ),

    transports: [
        new winston.transports
            .File({ level: 'error', filename: `${logStore}/stats_error.log`, }),
        new winston.transports
            .File({ level: 'debug', filename: `${logStore}/stats_debug.log`, }),
        new winston.transports
            .Console({ level: 'debug', })
    ],
    exceptionHandlers: [
        new winston.transports
            .File({ level: 'silly', filename: `${logStore}/stats_exception_combined.log`, })
    ],

});

//Logging Category for location filter improvement
container.add('locationLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'LOCATION', }),
        logFormat
    ),

    transports: [
        new winston.transports
            .File(
                { level: 'info', filename: `${logStore}/location_combined.log`, })
    ],
    exceptionHandlers: [
        new winston.transports
            .File({ level: 'silly', filename: `${logStore}/location_exception_combined.log`, })
    ],


});

//Logging Category for workers
container.add('workerLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'WORKER', }),
        logFormat
    ),
    transports: [
        new winston.transports
            .File({ level: 'error', filename: `${logStore}/worker_error.log`, }),
        new winston.transports
            .File({ level: 'debug', filename: `${logStore}/worker_debug.log`, }),
        new winston.transports
            .Console({ level: 'debug', })
    ],
    exceptionHandlers: [
        new winston.transports
            .File({ level: 'silly', filename: `${logStore}/worker_exception_combined.log`, })
    ],
    exitOnError: false,

});


//Export the Module
module.exports = (container);










