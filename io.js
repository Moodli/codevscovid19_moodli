//Create socket.io server
const express = require('express');
//Initialize the app
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

//Global Constant
const PORT = process.env.PORT || 3005;

//Start the Server (socket.io + app)
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

io.on('connect', socket => {

    socket.on('in', msg => console.log(msg));

});