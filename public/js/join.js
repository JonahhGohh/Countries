const joinButton = document.getElementById('join-button');
const playerName = document.getElementById('name');
const inputCode = document.getElementById('lobby-code');
const errorMsg = document.getElementById('error-msg');


//sends players to a different URL
joinButton.onclick = () => {
    window.location=`/lobby.html?name=${playerName.value}&lobbyCode=${inputCode.value}`;  
}

// const newDiv = document.createElement("div");
//             newDiv.innerHTML = "Lobby Code does not exist";
//             newDiv.style.color = "red";
//             console.log(newDiv);
//             errorMsg.appendChild(newDiv);