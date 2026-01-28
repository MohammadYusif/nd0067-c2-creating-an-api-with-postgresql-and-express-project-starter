const { query } = require('db-migrate-base');

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `);
};

exports.down = function(db) {
  return db.runSql('DROP TABLE users;');
};

exports._meta = {
  "version": 1
};
