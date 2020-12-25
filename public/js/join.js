const joinButtonHTML = document.getElementById('join-button');
const playerNameHTML = document.getElementById('name');
const inputCodeHTML = document.getElementById('lobby-code');
const errorMsgHTML = document.getElementById('error-msg');


//sends players to a different URL
joinButtonHTML.onclick = () => {
    const lobbyCodeUpperCase = inputCodeHTML.value.toUpperCase();
    if (inputCodeHTML.value == "" || playerNameHTML.value == "") {
        errorMsgHTML.innerHTML = "Please fill up the lobby code or your username";
        errorMsgHTML.style.color = "red";
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
                window.location = `/lobby.html?name=${playerNameHTML.value}&lobbyCode=${lobbyCodeUpperCase}`;  
            } else {
                outputErrorMessage();
            }
        });
    }
}

const outputErrorMessage = () => {
    errorMsgHTML.innerHTML = "Lobby Code does not exist";
    errorMsgHTML.style.color = "red";
}
