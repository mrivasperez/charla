const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io')

const app = express();

// Refactoring app creation
const server = http.createServer(app);

// configure socket to work w/ server
const io = socketio(server);

// configure port;
const port = 3000;

// configure directory
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// print msg to terminal when client connects
io.on('connection', () => {
    console.log('New WebSocket connection')
})

// start up http server
server.listen(port, () => {
    console.log(`Live at port ${port}`);
});

