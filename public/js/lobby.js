const userListHTML = document.getElementById('inLobby');
const codeHTML = document.getElementById('code');
const kickHTML = document.getElementById('kickButton');
const transferHTML = document.getElementById('transferButton');
const startGameHTML = document.getElementById('startGameButton');
const chatFormHTML = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

// Creates an object. Host: Name, Players: Name + room code
const queryParam = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// listen to chat input
chatFormHTML.addEventListener('submit', e => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    if (msg !== "") {
        socket.emit('chat message', msg);
        console.log(msg);
        // clear input and focus text box
        e.target.elements.msg.value = "";
        e.target.elements.msg.focus();
    }
})

socket.on('chat message', (msg) => {
    outputMessage(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Sends the 'join' event when a user enter's the lobby
socket.emit('join', queryParam);

socket.on('join', ({ name, lobbyUsers, lobbyCode}) => {
    // output users who are in the lobby
    // also highlight the user
    outputUsers(name, lobbyUsers);
    outputLobbyCode(lobbyCode); 
    
    // Create kick button for host
    hostKickButton(lobbyUsers);
    hostTransferButton(lobbyUsers);
    startGameButton(lobbyUsers);
})

socket.on('leaves', ({ name, lobbyUsers, lobbyCode }) => {
    outputUsers(name, lobbyUsers);
    outputLobbyCode(lobbyCode); 
    hostKickButton(lobbyUsers);
    hostTransferButton(lobbyUsers);
    startGameButton(lobbyUsers);
});

socket.on('transfer host', ({ prevHost, newHost, lobbyUsers, lobbyCode }) => {
    outputUsers(name, lobbyUsers);
    outputLobbyCode(lobbyCode); 
    hostKickButton(lobbyUsers);
    hostTransferButton(lobbyUsers);
    startGameButton(lobbyUsers);
})

// helps to fire the final event to kick the user
socket.on('kick helper', () => {
    socket.emit('kicked');
})

socket.on('kicked', () => {
    // remove user from current link
    window.location = '/';
})

const outputUsers = (name, lobbyUsers) => {
    userListHTML.innerHTML = `
    ${lobbyUsers.map(user => {
        if(user.isHost) {
            return `<li>${user.username} (HOST)</li>`;
        } else {
            return `<li>${user.username}</li>`;
        }
    }).join('')
}
`;
}

const outputLobbyCode = (lobbyCode) => {
    codeHTML.innerHTML = lobbyCode;
}

const hostKickButton = (lobbyUsers) => {
    const host = lobbyUsers.find(user => user.isHost);
    if(socket.id == host.id) {
        const nonHostUsers = lobbyUsers.filter(user => !user.isHost);
        const listToAdd = `${nonHostUsers.map(user => `<li><a id="${user.id}" class="dropdown-item kick-users" href="#">${user.username}</a></li>`).join('')}`;
        kickHTML.innerHTML = `
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        KICK 
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        ${listToAdd}
        </ul>
        </div>
        `;

        var elements = document.getElementsByClassName('kick-users');
        Array.from(elements).forEach((element) => {
            element.addEventListener('click', (event) => {
                socket.emit('kick', event.target.id);
            });
        });
    } else {
        kickHTML.innerHTML = "";
    }
}

const hostTransferButton = (lobbyUsers) => {
    const host = lobbyUsers.find(user => user.isHost);
    if(socket.id == host.id) {
        const nonHostUsers = lobbyUsers.filter(user => !user.isHost);
        const listToAdd = `${nonHostUsers.map(user => `<li><a id="${user.id}" class="dropdown-item transfer-users" href="#">${user.username}</a></li>`).join('')}`;
        transferHTML.innerHTML = `
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        TRANSFER 
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        ${listToAdd}
        </ul>
        </div>
        `;

        var elements = document.getElementsByClassName('transfer-users');
        Array.from(elements).forEach((element) => {
            element.addEventListener('click', (event) => {
                socket.emit('transfer host', event.target.id);
            });
        });
    } else {
        transferHTML.innerHTML = "";
    }
}

const outputMessage = (msg) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">${msg.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

const startGameButton = (lobbyUsers) => {
    const host = lobbyUsers.find(user => user.isHost);
    if(socket.id == host.id) {
        const nonHostUsers = lobbyUsers.filter(user => !user.isHost);
        startGameHTML.innerHTML = `
        <button id="start-game" type="button" class="btn btn-primary">Start Game</button>
        `;
        const startGameButton = document.getElementById('start-game');
        startGameButton.addEventListener('click', (event) => {
            socket.emit('start game');
        })
    } else {
        transferHTML.innerHTML = "";
    }
}
