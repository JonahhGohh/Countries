const joinCodeHTML = document.getElementById('join-code');

const linkHTML = "window.location=`/lobby.html?name=${document.getElementById('name').value}&lobbyCode=${document.getElementById('lobby-code').value}`;";

const insertJoinForm = () => {
    joinCodeHTML.innerHTML = `<input id="lobby-code" style="text-transform:uppercase" /><button onclick="${linkHTML}">Join Game</button>`
}
