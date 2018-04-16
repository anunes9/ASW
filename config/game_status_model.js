var Sequelize   = require('sequelize');
var connection  = require('./deploy');
var User        = require('./user_model');
var GameRequest = require('./game_request_model');


var baralho = ["AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
"AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
"AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
"AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS"];

// Using Fisher–Yates shuffle algorithm

function shuffle(array) {
	var m = array.length, t, i;
	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);
		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

var GameStatus = connection.define('game_status', {
	// details
	id          : { type: Sequelize.INTEGER, unique: true, autoIncrement: true, primaryKey: true},
	request_id  : { type: Sequelize.INTEGER, allowNull: false, unique: true},
	started_at  : { type: Sequelize.DATE, allowNull: false},
	ended_at    : { type: Sequelize.DATE},
	status      : { type: Sequelize.ENUM, values: ['F', 'NF'], allowNull: false , defaultValue: 'NF'},
	// cards
	deck        : { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: false, defaultValue: shuffle(baralho)},
	table_cards : { type: Sequelize.ARRAY(Sequelize.STRING)},
	// current status
	current_bet : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
	current_pot : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0}},
	{
		freezeTableName: true
});

// Game Request id same as id
GameRequest.hasOne(GameStatus, {foreignKey: 'request_id'});
// last_to_rise is a User
User.hasOne(GameStatus, { as: 'last_to_rise', foreignKey: 'last_to_rise'});
// current_player is a User
User.hasOne(GameStatus, { as: 'current_player', foreignKey: 'current_player'});

module.exports = GameStatus;
