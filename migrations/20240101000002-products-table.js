const { query } = require('db-migrate-base');

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      category VARCHAR(100)
    );
  `);
};

exports.down = function(db) {
  return db.runSql('DROP TABLE products;');
};

exports._meta = {
  "version": 1
};
