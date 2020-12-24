const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { userJoin, getCurrentUser, userLeaves, getLobbyUsers, doesLobbyExist, isHost } = require('./utils/users');
const makeId = require('./utils/code');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // connect
    socket.on('join', (queryParam) => {
        const name = queryParam.name;
        let lobbyCode = queryParam.lobbyCode;
        if (lobbyCode) {
            // when user joins
            if (doesLobbyExist(lobbyCode.toUpperCase())) {
                lobbyCode = lobbyCode.toUpperCase();
            } else {
                socket.emit('no lobby found');
            }
            const user = userJoin(socket.id, name, lobbyCode);
        } else {
            // when host creates
            lobbyCode = makeId();
            const user = userJoin(socket.id, name, lobbyCode);
        }
        socket.join(lobbyCode);
        io.to(lobbyCode).emit('join', {
            name,
            lobbyUsers: getLobbyUsers(lobbyCode),
            lobbyCode
        })
    })

    // disconnect
    socket.on('disconnect', () => {
        console.log("user disconnected");
        const user = userLeaves(socket.id);
        io.to(user.lobbyCode).emit('room users', {
            lobbyCode: user.lobbyCode,
            users: getLobbyUsers(user.lobbyCode)
        })
    });
})

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));