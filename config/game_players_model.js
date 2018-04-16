var Sequelize  = require('sequelize');
var connection = require('./deploy');
var User       = require('./user_model');
var GameRequest = require('./game_request_model');


var GamePlayers = connection.define('game_players', {
	game_id    	  : { type: Sequelize.INTEGER, allowNull: false},
	player_bet    : { type: Sequelize.INTEGER},
	player_id     : { type: Sequelize.INTEGER, allowNull: false, unique: true},
	player_folded : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}},
	{
		freezeTableName: true
	}
 );

// player_id is a User
User.hasOne(GamePlayers, {foreignKey: 'player_id'});
// Game Request id same as request_id
GameRequest.hasOne(GamePlayers, {foreignKey: 'game_id'});

module.exports = GamePlayers;
