// Dependencies
const mongoose = require('mongoose');

// Global Variables
const MongodbPass = require('../creds/mongoKey');

// Connect to DB
const DB_Connection = mongoose.createConnection(MongodbPass.Database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});


module.exports = { DB_Connection, };
