var Sequelize = require('sequelize');
var connection = require('./deploy');

var Admin = connection.define('admin', {
	id       : { type: Sequelize.INTEGER, unique: true, autoIncrement: true, primaryKey: true},
	username : { type: Sequelize.STRING, unique: true, allowNull: false},
	email    : { type: Sequelize.STRING, unique: true, allowNull: false },
	pwd      : { type: Sequelize.STRING, allowNull: false }},
	{
		freezeTableName: true
	});

module.exports = Admin;
