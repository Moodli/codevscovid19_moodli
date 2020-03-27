
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
container.add('passportLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'PASSPORT AUTH' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for inbox.js
container.add('inboxLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'INBOX' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for interactive.js
container.add('interactiveLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'INTERACTIVE' }),
        logFormat,
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for auth.js
container.add('authLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'OAUTH' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for static.js
container.add('staticLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'STATIC' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for Active Sessions
container.add('sessionLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'SESSION' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for Active Sessions + Sys. Info.
container.add('sysmonitLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'SYSMONIT' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});

//Logging Category for String Similarity Comparison
container.add('simcompLog', {
    format: winston.format.combine(
        winston.format.label({ label: 'SIMCOMP' }),
        logFormat
    ),
    transports: [new winston.transports.Console()],
    exitOnError: false

});



//Export the Module
module.exports = (container);










