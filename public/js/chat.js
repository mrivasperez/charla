const socket = io();

// ELEMENTS
const inputForm = document.getElementById("inputForm"),
  chatInput = document.getElementById("chatInput"),
  sendBtn = document.getElementById("sendBtn"),
  locationBtn = document.getElementById("locationBtn"),
  messages = document.getElementById("messages");

// TEMPLATES
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on("message", message => {
  console.log(message);

  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mma')
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationLink", link => {
  const locationMessage = "My current location";
  const html = Mustache.render(locationTemplate, {
    link,
    locationMessage,
    locationCreatedAt: function() {
        return moment(new Date().getTime()).format('h:mma')
    } 
  });

  messages.insertAdjacentHTML("beforeend", html);
});



// send message
sendBtn.addEventListener("click", e => {
  // disable message input temporarily
  sendBtn.setAttribute("disabled", "disabled");
  socket.emit("messageSent", chatInput.value, acknowledgement => {
    console.log(acknowledgement);

    //reenable message iput

  });
  sendBtn.removeAttribute("disabled");
  chatInput.value = "";
});

// send location to users
locationBtn.addEventListener("click", e => {


  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation services.");
  }

  navigator.geolocation.getCurrentPosition(position => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let currentPosition = `${latitude},${longitude}`;
    socket.emit("sendLocation", currentPosition, acknowledgement => {
      messages.insertAdjacentHTML("beforeend", html);
      locationBtn.removeAttribute("disabled");
    });
  });
});

// Emit room
socket.emit('join', {username, room})