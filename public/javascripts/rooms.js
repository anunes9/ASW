/**
 * o pato toca
 * mas a toca não toca
 * o que é que não toca ?
 */

/**
 * Handle rooms page using socket.io
 *
 */

/*
$(document).ready(function () {
	socket.emit('roomsPageReady', '');
});
*/

 function handlerooms(id) {

	console.log('rooms.hbs:: login done');

	socket.emit('first');

	socket.on('fetchRooms', function(data) {
		console.log('rooms.js::fetchRooms: calling refresh_rooms...');
        frontRefreshRooms(data);
	});

	socket.on('addGameSucess', function(data) {  
		console.log(data);
	});

	socket.on('addGameError', function(data) {
		console.log(data);
	});

    socket.on('addPlayerToGame', function(data) {
        console.log('rooms.js::addPlayerToRoom: player adicionado!');
        console.log('\nServidor: ' + data);
    });


    socket.on('addPlayerToGameError', function(data) {
        console.log(data);
    });


	socket.on('updateGames', function(data) {
		console.log('rooms.js::updateGames: calling refresh_rooms...');
        frontRefreshRooms(data);
	});
}

/**
 * Create a room using socket.io
 *
 */

function addGame(id, user) {

	console.log('rooms.js::addGame: sou o user: ' + id);
	
	socket.emit('addGame', {
		name: $("#gname").val(), 
		description: $("#descr").val(), 
		maxPlayers: $("#nplayers").val(), 
		owner: id,
		username: user,
		first_bet: $("#initbet").val()
	});
}