const hostButton = document.getElementById('host-button');
const playerName = document.getElementById('name');

hostButton.onclick = () => {
    window.location=`/lobby.html?name=${playerName.value}`;
}