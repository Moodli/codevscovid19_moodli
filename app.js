
/*eslint-env node*/

//Dependencies
const express = require('express');
const BodyParser = require('body-parser');
const compression = require('compression');
const exphbs = require('express-handlebars');
const path = require('path');


//Custom modules
const { childSpawn, } = require('./config/childSpawn');

// Winston Logger
const appLog = require('./config/logs').get('appLog');


//Global Constant || Heroku Deployment Setup
const PORT = process.env.PORT || 3005;

//Initialize the App
const app = express();

//Initialize socket.io server
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    // path: '/',
    // serveClient: true,
    // // below are engine.IO options
    // pingInterval: 10000,
    // pingTimeout: 5000,
    // cookie: false,
});

//Compression Module
app.use(compression({ level: 9, memLevel: 9, }));

//Disable etag
app.set('etag', false);
app.set('x-powered-by', false);

// BodyParser Middleware
app.use(BodyParser.urlencoded({
    extended: true,
    limit: '5mb',
}));

app.use(BodyParser.json({
    limit: '5mb',
    extended: true,
}));

//Set Static Folder (Absolute)
app.use('/', express.static(path.join(__dirname, '/assets')));

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main',

}));

app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));

app.all('*', (req, res, next) => {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'https://moodli.xx');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'false');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    //No cache
    // res.setHeader('Cache-Control', 'max-age=120,private');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// //Start the app with socket io;
// const io = require('socket.io')(app.listen(port, () => {
//     appLog.info(`Server is listening on port ${port}`);
// }));


//Start the Server (socket.io + app)
server.listen(PORT, () => {
    appLog.info(`Server is listening on port ${PORT}`);
});

// Dump data from MongoDB
setInterval(() => {
    childSpawn();
}, 300 * 200);



//Export socket io Server before the route so it's
//loaded when used in the routes
module.exports = { io, };

//Load Routes
const tweet = require('./routes/tweet');

//Use Routes
app.use('/', tweet);


//Array conversion
// const fs = require("fs");
// let text = fs.readFileSync("./x.txt").toString('utf-8');
// let array = text.split("\r\n");
// fs.writeFileSync("./array",  JSON.stringify(array))
