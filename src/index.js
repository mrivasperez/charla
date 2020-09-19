const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { callbackify } = require('util');

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
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    // send message whenever a new client connects
    socket.emit('messageReceived', 'Welcome to Charla!')
    // broacast that new usser has joined to all except user
    socket.broadcast.emit('messageReceived', 'A new user has joined!')

    // listen for incoming messages
    socket.on('messageSent', (message, acknowledgement) => {
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return acknowledgement('Profanity is not allowed!')
        }
        acknowledgement('Message delivered!')
        io.emit('messageReceived', message);
    })

    // listen for location sending
    socket.on('sendLocation', (currentPosition, acknowledgement) => {
        if(!currentPosition) {
            return acknowledgement('Your location could not be accessed.')
        }
        acknowledgement('Location received.')
        io.emit('locationLink', `https://google.com/maps?q=${currentPosition}`);
    })
    
    socket.on('disconnect', () => {
        io.emit('messageReceived', "A user has left.")
    })
})

// start up http server
server.listen(port, () => {
    console.log(`Live at port ${port}`);
});

