import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

let socket, backend;

var messages = document.getElementById('messages');
var username = document.getElementById('username');
var errorMessage = document.getElementById('error-message');
var connectBtn = document.getElementById('connect-button');

if(location.hostname == "100.115.92.206" || location.hostname == "localhost" || location.hostname == "127.0.0.1") {
    backend = "http://" + location.hostname + ":8080";
} else {
    backend = "https://backend-hdhtb3y7gq-ew.a.run.app";
}


//
// launch connection
//
const connectWS = () => {
    
    socket = io(backend, { transports : ['websocket'] });

    // when new messages arrives !
    socket.on('chat:message', function(msg) {
        var item = document.createElement('div');
        item.innerHTML = (msg.user ? "<b>" + msg.user + "</b>: " : "") + msg.text;

        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
    });
    
    localStorage.setItem('username', username.value);

    // newly connected
    socket.emit('user:connect', username.value );

    connectBtn.innerHTML = 'DISCONNECT';
    username.disabled = true;
}

const disconnectWS = () => {
    connectBtn.innerHTML = 'CONNECT';
    // broadcast disconnect event
    socket.emit('user:disconnected', username.value );
    if(socket) socket.disconnect();
    username.disabled = false;
    messages.innerHTML = '';
}

// connect/disconnect
connectBtn.addEventListener('mouseup', function(e) {
    if(username.value && connectBtn.innerHTML == 'CONNECT') {
        connectWS();
    } else {
        disconnectWS();
    }
});

// send a message
let form = document.getElementById('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // erase error message
    errorMessage.innerText = "";

    if(!username.value) {
        errorMessage.innerText = "Enter a username";
        localStorage.setItem('username', '');
        return;
    }

    let input = document.getElementById('input');
    if (input.value) {
        socket.emit('chat:message', { user: username.value, text: input.value });
        input.value = '';
    }
});

window.addEventListener('beforeunload', () => {
    disconnectWS();
});

username.value = localStorage.getItem('username');

const getNumberofUsers = () => {
    fetch(backend + '/count').then(response => {
        response.text().then(text => document.getElementById('number_of_users').innerText = "Number of connected users : " + text);
    });
};

getNumberofUsers();

// poll
setInterval(() => getNumberofUsers(), 5000);
