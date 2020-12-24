const joinButton = document.getElementById('join-button');
const playerName = document.getElementById('name');
const inputCode = document.getElementById('lobby-code');
const errorMsg = document.getElementById('error-msg');


//sends players to a different URL
joinButton.onclick = () => {
    const lobbyCodeUpperCase = inputCode.value.toUpperCase();
    if (inputCode.value == "" || playerName.value == "") {
        errorMsg.innerHTML = "Please fill up the lobby code or your username";
        errorMsg.style.color = "red";
    } else {
        const data = { 
            lobbyCode: lobbyCodeUpperCase
        };
        const otherParam = {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const postURL = './join.html';
        fetch(postURL, otherParam)
        .then(data => {
            const httpStatus = data.status;
            if (httpStatus == 200) {
                window.location = `/lobby.html?name=${playerName.value}&lobbyCode=${lobbyCodeUpperCase}`;  
            } else {
                outputErrorMessage();
            }
        });
    }
}

const outputErrorMessage = () => {
    errorMsg.innerHTML = "Lobby Code does not exist";
    errorMsg.style.color = "red";
}
