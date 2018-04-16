/*
 *  Siga lá
 *
 */


function waiting(id, gameId) {

    // define game room link and data to send in the socket
    var roomid = '/games/' + gameId;
    var data = {room: roomid, gameId: gameId, userId: id};

    socket.emit('joinGame', data);
}

function gotogame(gameId, bet) {
    var roomid = '/games/' + gameId;
    var data = {room: roomid, gameId: gameId, inicialBet: bet};

    socket.emit('enterGame', data);
}

function foldbet () {

}

function coverbet () {

}

function raisebet() {

}
