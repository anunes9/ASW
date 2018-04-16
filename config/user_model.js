var Sequelize   = require('sequelize');
var connection  = require('./deploy');
var GameRequest = require('./game_request_model');


var User = connection.define('users', {
	id        : { type: Sequelize.INTEGER, unique: true, autoIncrement: true, primaryKey: true},
	username  : { type: Sequelize.STRING, unique: true, allowNull: false},
	email     : { type: Sequelize.STRING, unique: true, allowNull: false },
	pwd       : { type: Sequelize.STRING, allowNull: false },
	firstname : { type: Sequelize.STRING, allowNull: false },
	lastname  : { type: Sequelize.STRING, allowNull: false },
	birthday  : { type: Sequelize.DATEONLY, allowNull: false },
	gender    : { type: Sequelize.ENUM, values: ['M', 'F'], allowNull: false },
	country   : { type: Sequelize.STRING, allowNull: false },
	city      : { type: Sequelize.STRING, allowNull: false },
	district  : { type: Sequelize.STRING, allowNull: false },
	credit    : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 50}},
	{
		freezeTableName: true
	},
	{
		indexes: [{ unique: true, fields: ['email', 'username', 'id']}]
	}
);

User.hasOne(GameRequest, { foreignKey: 'owner' });

module.exports = User;
