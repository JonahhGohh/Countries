// keeps tracks of the users in an array of object
const users = [];

// user joining the room
const userJoin = (id, username, lobbyCode) => {
    const user = {id, username, lobbyCode, isHost: false};
    if (!doesLobbyExist(lobbyCode)) {
        // makes user host if lobby has no one
        user.isHost = true;
    }
    users.push(user);
    return user;
}

// find user by id
const getCurrentUser = id => {
    return users.find(user => user.id === id);
}

// user leaves, remove it from the array
const userLeaves = id => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// get all the lobby users
const getLobbyUsers = lobbyCode => {
    return users.filter(user => user.lobbyCode === lobbyCode);
}

// check if lobby is empty
const doesLobbyExist = (lobbyCode) => {
    return getLobbyUsers(lobbyCode).length !== 0;
}

// check if user is host
const isHost = user => {
    return user.isHost;
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getLobbyUsers,
    doesLobbyExist,
    isHost
}
