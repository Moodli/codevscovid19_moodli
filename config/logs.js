
'use strict';
/*eslint-env node*/

//Dependencies
const winston = require('winston');
//Custom Log Format
const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    //Determine Message type => special handling for object and error
    winston.format.printf(info => {
        if (info.message.constructor == Object || Error) {
            if (info.stack == undefined) {
                return `${info.timestamp} [${info.label}] ${info.level}: ${JSON.stringify(info.message, null, 1)}`;
            } else {
                return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} Stack: ${info.stack}`;
            }
        } else {
            return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
        }

    })
);



//Container for Multiple Loggers
const container = new winston.Container();


//Logging Category for dbConnection.js
container.add('dbCon', {
    format: winston.format.combine(
        winston.format.label({ label: 'dbConnection' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for app.js
container.add('appLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'APP' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for passport-local.js
container.add('subprocessLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'CHILD' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});



//Export the Module
module.exports = (container);










