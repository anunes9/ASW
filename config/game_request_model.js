var Sequelize  = require('sequelize');
var connection = require('./deploy');
// var User       = require('./user_model');


var GameRequest = connection.define('game_request', {
	id          : { type: Sequelize.INTEGER, unique: true, autoIncrement: true, primaryKey: true},
	name        : { type: Sequelize.STRING, allowNull: false },
	description : { type: Sequelize.STRING },
	maxPlayers  : { type: Sequelize.INTEGER, allowNull: false },
	countPlayers: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
	owner       : { type: Sequelize.INTEGER, allowNull: false, unique: true},
	ownerName	: { type: Sequelize.STRING },
	first_bet   : { type: Sequelize.INTEGER, allowNull: false },
	started		: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
	finished    : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}},
	// owner association in User
	// User.hasOne(GameRequest, { as: 'owner', foreignKey: 'owner'});
	{
		freezeTableName: true
	}
);

module.exports = GameRequest;