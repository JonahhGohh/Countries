const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const { userJoin, getCurrentUser, userLeaves, getLobbyUsers, doesLobbyExist, isHost } = require('./utils/users');
const makeId = require('./utils/code');


//Create a HTTP server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Joining HTML + CSS files in 'public' folder with javascript
app.use(express.static(path.join(__dirname, 'public')));

// prepare any data to be read from requests with JSON format using bodyParser
app.use( bodyParser.json() ); 

// socket.io listening event
io.on('connection', (socket) => {
    
    // Listen's to 'join' event; Establish host
    socket.on('join', (queryParam) => {
        const name = queryParam.name;
        let lobbyCode = queryParam.lobbyCode;
        if (!lobbyCode) {
            // when host creates
            lobbyCode = makeId();

        }

        const user = userJoin(socket.id, name, lobbyCode, socket);
        socket.join(lobbyCode);
        io.to(lobbyCode).emit('join', {
            name,
            lobbyUsers: getLobbyUsers(lobbyCode),
            lobbyCode
        })
    })

    // On kick emits the event to the user who is getting kicked. This is to get the socket object of the user to disconnect
    socket.on('kick', (socketId) => {
        socket.to(socketId).emit('kick helper');
    })

    // receive final kick from socket of user getting kicked
    socket.on('kicked', () => {
        console.log(getCurrentUser(socket.id).username);
        socket.emit('kicked');
        socket.disconnect();
    })

    // On disconnect
    socket.on('disconnect', () => {
        console.log("user disconnected");
        
        // Updates the userboard in the lobby when someone leaves
        const user = userLeaves(socket.id);
        const currRoomUsers = getLobbyUsers(user.lobbyCode)
        if (isHost(user) && currRoomUsers.length > 0) {
            // pass the host to the next user in line
            const newHost = currRoomUsers[0];
            console.log(newHost);
            newHost.isHost = true;
        }
        io.to(user.lobbyCode).emit('leaves', {
            name: user.username,
            lobbyUsers: getLobbyUsers(user.lobbyCode),
            lobbyCode: user.lobbyCode  
        })
    });
})

// listen to post request from join.js
app.post('/join.html', (req, res) => {
    // figure out how to get the body of the req
    if (doesLobbyExist(req.body.lobbyCode)) {
        // allow user to proceed to next page
        res.sendStatus(200);
    } else {
        // disallow user to proceed next page
        res.sendStatus(404);
    }
})

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));