const socket = io();

// ELEMENTS
const inputForm = document.getElementById('inputForm'),
    chatInput = document.getElementById('chatInput'),
    sendBtn = document.getElementById('sendBtn'),
    locationBtn = document.getElementById('locationBtn'),
    messages = document.getElementById('messages');

// TEMPLATES
const messageTemplate = document.getElementById('message-template').innerHTML;

socket.on('messageReceived', message => {
    console.log(message);

    const html = Mustache.render(messageTemplate);
})

// send message
sendBtn.addEventListener('click', e => {
    // disable message input temporarily
    sendBtn.setAttribute('disabled', 'disabled');
    socket.emit('messageSent', chatInput.value, acknowledgement => {
        console.log(acknowledgement)

        //reenable message iput
        sendBtn.removeAttribute('disabled')
    });

    chatInput.value = '';
})

// send location to users
locationBtn.addEventListener('click', e => {
    locationBtn.setAttribute('disabled', 'disabled');

    if (!navigator.geolocation) {
        return alert('Your browser does not support geolocation services.');
    };

    navigator.geolocation.getCurrentPosition(position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let currentPosition = `${latitude},${longitude}`;
        socket.emit('sendLocation', currentPosition, acknowledgement => {
            console.log(acknowledgement);
            locationBtn.removeAttribute('disabled');
        })
    })

})



socket.on('')