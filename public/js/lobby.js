const userListHTML = document.getElementById('inLobby');
const codeHTML = document.getElementById('code');
const kickHTML = document.getElementById('kickButton');
const socket = io();

const queryParam = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('join', queryParam);

socket.on('join', ({ name, lobbyUsers, lobbyCode}) => {
    // output users who are in the lobby
    // also highlight the user
    outputUsers(name, lobbyUsers);
    outputLobbyCode(lobbyCode); 
    
    // Create kick button for host
    hostKickButton(lobbyUsers);
})

socket.on('leaves', ({ name, lobbyUsers, lobbyCode }) => {
    outputUsers(name, lobbyUsers);
    outputLobbyCode(lobbyCode); 
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
        kickHTML.innerHTML = `
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        KICK 
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="#">A</a></li>
        <li><a class="dropdown-item" href="#">B</a></li>
        <li><a class="dropdown-item" href="#">C</a></li> 
        </ul>
        </div>
        `;
    }
    
}

