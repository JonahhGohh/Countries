const joinButton = document.getElementById('join-button');
const playerName = document.getElementById('name');
const inputCode = document.getElementById('lobby-code');
const errorMsg = document.getElementById('error-msg');

const { lobby } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

if (lobby) {
    errorMsg.innerHTML = "Lobby does not exist. Please try again!";
    errorMsg.style.color = "red";
}

joinButton.onclick = () => {
    if (inputCode.value == "" || playerName.value == "") {
        errorMsg.innerHTML = "Please fill up the lobby code or your username";
        errorMsg.style.color = "red";
    } else {
        window.location = `/lobby.html?name=${playerName.value}&lobbyCode=${inputCode.value}`;  
    }
}

// const newDiv = document.createElement("div");
//             newDiv.innerHTML = "Lobby Code does not exist";
//             newDiv.style.color = "red";
//             console.log(newDiv);
//             errorMsg.appendChild(newDiv);