const socket = io();

const queryParam = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('join', queryParam);
