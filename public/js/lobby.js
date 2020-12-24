const userListHTML = document.getElementById('inLobby');
const codeHTML = document.getElementById('code');
const socket = io();

const queryParam = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('join', queryParam);

socket.on('join', ({name, lobbyUsers, lobbyCode}) => {
    // output users who are in the lobby
    // also highlight the user
    console.log(lobbyCode);
    outputUsers(name, lobbyUsers);
    outputLobbyCode(lobbyCode);
})

socket.on('no lobby found', () => {
    window.location = '/join.html?lobby=doesNotExist';
})

const outputUsers = (name, lobbyUsers) => {
    userListHTML.innerHTML = `
    ${lobbyUsers.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

const outputLobbyCode = (lobbyCode) => {
    codeHTML.innerHTML = lobbyCode;
}
