
// Fix mem leak.
require('events').EventEmitter.defaultMaxListeners = 30;

// Load env vars
const { NODE_ENV, } = process.env;
if (NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('./creds/env');
}

// Dependencies
const memwatch = require('@airbnb/node-memwatch');
const express = require('express');
const compression = require('compression');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const { routeCheck, } = require('express-suite');

// Winston Logger
const appLog = require('./config/system/logs').get('appLog');
memwatch.on('leak', info => appLog.error(info));

// Custom modules
const { sentimentProccess, csvResetProccess, } = require('./config/textProcessors/sentiment');

// Write Stream Parameters
const csvLocation = path.join(__dirname, './mlModel/tweets.csv');
const writeSt = fs.createWriteStream(csvLocation, { flags: 'a', });

// Flush the Files
fs.writeFileSync('./mlModel/tweets.csv', '');

// CSV Column Names
writeSt.write('text,location,textHuman');

// Global Constant
const PORT = process.env.PORT || 3005;

// Initialize the App
const app = express();

// Compression Module
app.use(compression({ level: 9, memLevel: 9, }));

// Disable etag
app.set('etag', false);
app.set('x-powered-by', false);

// BodyParser Middleware
app.use(express.urlencoded({
    extended: true,
    limit: '5mb',
}));

app.use(express.json({
    limit: '5mb',
    extended: true,
}));

// Set Static Folder (Absolute) 
app.use('/', express.static(path.join(__dirname, '/assets')));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));

// Set view engine
app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));

// Express config
app.all('*', (req, res, next) => {

    //  Website you wish to allow to connect
    //  res.setHeader('Access-Control-Allow-Origin', 'https:// moodli.xx');
    res.setHeader('Access-Control-Allow-Origin', '*');
    //  Set to true if you need the website to include cookies in the requests sent
    //  to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'false');

    //  Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    //  Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    // No cache
    //  res.setHeader('Cache-Control', 'max-age=120,private');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Start the app with socket io;
const io = require('socket.io')(app.listen(PORT, () => {
    appLog.info(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
}), {
    allowUpgrades: true,
    transports: ['websocket'],
});

// Run the model every 5 sec
setInterval(async () => {
    await sentimentProccess();
}, 5000 * 4);


// Export socket io Server before the route so it's loaded when used in the routes
module.exports = { io, };

// Load Routes
const tweet = require('./routes/tweet');

// Use Routes
app.use('/', tweet);

// Route Check
app.use(routeCheck(app));

// Clean the CSV file every half an hour
setInterval(async () => {
    await csvResetProccess();
}, 60000 * 15);

// Handle SIGINT from terminal
process.on('SIGINT', () => process.exit(0));

// Handle SIGUP from nodemon
process.on('SIGUP', () => process.exit(0));