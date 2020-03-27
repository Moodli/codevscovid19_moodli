/*eslint-env node*/
'use strict'
//Dependencies
const mongoose = require('mongoose');
//Winston Logger
const logger = require('./logs');
const dblog = logger.get('dbCon');
//Global Variables
const MongodbPass = require('../creds/mongoKey');

//Connect to DB
const DB_Connection = mongoose.createConnection(MongodbPass.Database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
DB_Connection
    .once('open', () => dblog.info('DB Connected'))
    .catch(err => dblog.error('Error Connecting to DB' + ' ' + err));

module.exports = { DB_Connection };
