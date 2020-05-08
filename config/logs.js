

/*eslint-env node*/

//Dependencies
const winston = require('winston');

//Global variables
let readableDate = () => {
    return new Date(Date.now()).toUTCString();
};


//Custom Log Format
const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true, }),

    winston.format.printf(info => {

        // //Determine Message type => special handling for object and error

        if (!info.stack) {
            return `${info.timestamp} | ${readableDate()} | [${info.label}] ${info.level}: ${JSON.stringify(info.message, null, 0)}`;
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
    transports: [new winston.transports.Console()],
    exitOnError: false,

});

//Logging Category for app.js
container.add('appLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'APP', }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false,

});

//Logging Category for passport-local.js
container.add('subprocessLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'CHILD', }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false,

});



//Export the Module
module.exports = (container);










