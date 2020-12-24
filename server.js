const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const { userJoin, getCurrentUser, userLeaves, getLobbyUsers, doesLobbyExist, isHost } = require('./utils/users');
const makeId = require('./utils/code');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

// prepare any data to be read from requests with JSON format using bodyParser
app.use( bodyParser.json() ); 

// socket.io listening event
io.on('connection', (socket) => {
    // connect
    socket.on('join', (queryParam) => {
        const name = queryParam.name;
        let lobbyCode = queryParam.lobbyCode;
        if (!lobbyCode) {
            // when host creates
            lobbyCode = makeId();
        }
        const user = userJoin(socket.id, name, lobbyCode);
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