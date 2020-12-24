// Allow usage of socket.io functions through script library in HTML
const socket = io();

// Creates an object. Host: Name, Players: Name + room code
const queryParam = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Sends the 'join' event when a user enter's the lobby
socket.emit('join', queryParam);
