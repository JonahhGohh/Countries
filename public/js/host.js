const hostButtonHTML = document.getElementById('host-button');
const playerNameHTML = document.getElementById('name');
const errorMsgHTML = document.getElementById('error-msg');


// Sends hosts to a different url
hostButtonHTML.onclick = () => {
    console.log(playerNameHTML.value);
    if (playerNameHTML.value === "") {
        errorMsgHTML.innerHTML = "Please fill up the lobby code or your username";
        errorMsgHTML.style.color = "red";
    } else {
        window.location=`/lobby.html?name=${playerNameHTML.value}`;
    }
}