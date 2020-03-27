'use strict';
/*eslint-env node*/

//Dependencies
const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
const compression = require('compression');

// Winston Logger
const logger = require('./config/logs');
const appLog = logger.get('appLog');


//Global Constant || Heroku Deployment Setup
const port = process.env.PORT || 3005;

//Initialize the App
const app = express();

//Compression Module
app.use(compression());

// BodyParser Middleware
app.use(BodyParser.urlencoded({
    extended: true,
    limit: '5mb',
}));

app.use(BodyParser.json({
    limit: '5mb',
    extended: true
}));





//Method Override Middleware
app.use(methodOverride('_method'));

//Set Static Folder (Absolute)
app.use('/', express.static(path.join(__dirname, '/assets')));

app.all('*', function (req, res, next) {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'https://moodli.xx');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //No cache
    res.setHeader('Cache-Control', 'no-cache');

    next();
});

// //Load Routes
// const Error_Msg = require('./routes/errors');

// //Use Routes
// app.use('/', Error_Msg);

//Start the app
app.listen(port, () => {
    appLog.info(`Server is listening on port ${port}`);
});