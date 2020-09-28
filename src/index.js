const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");

const app = express();

// Refactoring app creation
const server = http.createServer(app);

// configure socket to work w/ server
const io = socketio(server);

// configure port;
const port = 3000;

// configure directory
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
console.log(publicDirectoryPath)

// print msg to terminal when client connects
io.on("connection", socket => {
  console.log("New WebSocket connection");


  socket.on('join', (info) => {
    socket.join(info.room);
    console.log(info);
    // send message whenever a new client connects
    socket.emit("message", generateMessage("Welcome!"));
    // broacast that new usser has joined to all except user
    socket.broadcast.to(info.room).emit("message", generateMessage(`${info.username} has joined!`));
  });

  // listen for incoming messages
  socket.on("messageSent", (message, acknowledgement) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return socket.emit('message', generateMessage("Profanity is not allowed."));
    }
    socket.emit('message', generateMessage("Message delivered!"));
    io.emit("message", generateMessage(message));
  });

  // listen for location sending
  socket.on("sendLocation", (currentPosition, acknowledgement) => {
    if (!currentPosition) {
      return acknowledgement("Your location could not be accessed.");
    }
    socket.emit('message', generateMessage("Location received."));
    io.emit("locationLink", `https://google.com/maps?q=${currentPosition}`);
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left."));
  });
});

// start up http server
server.listen(port, () => {
  console.log(`Live at port ${port}`);
});
