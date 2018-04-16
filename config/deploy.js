var Sequelize = require('sequelize');

var match, config, connection;

// look for Heroky Postgresql (disponivel em producao)
if (process.env.DATABASE_URL) {

  match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

  config = {
    user: match[1],
    pass: match[2],
    base: match[5],
    options: {
      dialect  : 'postgres',
      protocol : 'postgres',
      host     : match[3],
      logging  : false,
      port     : match[4],
      dialectOptions: {
        ssl: true
      }
    }
  };

  if (config) {
    connection = new Sequelize(config.base, config.user, config.pass, config.options);
  }

  connection.authenticate()
      .then(function () {
          console.log('\n\n\n' + 'Heroku PostgreSQL Connected!' + '\n\n\n');
      })
      .catch(function (err) {
          console.log('\n\n\n' + 'Heroku PostgreSQL Failed! Fallback to SQLite3' + '\n\n\n');
          connection = new Sequelize('sqlite://database.db');
      })
      .done();
}

else {
    // em desenvolvimento, usar sqlite3
    console.log('\n\n\n' + 'Development Stage. Using SQLite3' + '\n\n\n');
    connection = new Sequelize('sqlite://database.db');
}

module.exports = connection;
