// Dependencies
const mongoose = require('mongoose');

// Global Variables
const MongodbPass = require('../creds/mongoKey');

// Winston Logger   
const dbLog = require('./logs').get('dbCon');

// Connect to DB
const DB_Connection = mongoose.createConnection(MongodbPass.Database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

DB_Connection
    .once('open', () => dbLog.info('DB Connected'))
    .catch(err => dbLog.error('Error Connecting to DB' + ' ' + err));


module.exports = { DB_Connection, };
