const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { userJoin, getCurrentUser, userLeaves, getLobbyUsers, doesLobbyExist, isHost } = require('./utils/users');
const makeId = require('./utils/code');


//Create a HTTP server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Joining HTML + CSS files in 'public' folder with javascript
app.use(express.static(path.join(__dirname, 'public')));


// When a user connects
io.on('connection', (socket) => {
    
    //
    socket.on('join', (queryParam) => {
        const name = queryParam.name;
        const lobby = queryParam.lobbyCode;
        if (lobby) {
            console.log('lobby runs when undefined');
        } else {
            console.log('else lobby runs when undefined');
        }
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