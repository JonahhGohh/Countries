const hostButton = document.getElementById('host-button');
const playerName = document.getElementById('name');


// Sends hosts to a different url
hostButton.onclick = () => {
    window.location=`/lobby.html?name=${playerName.value}`;
}