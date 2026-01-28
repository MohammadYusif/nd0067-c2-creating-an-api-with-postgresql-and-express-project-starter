const { query } = require('db-migrate-base');

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL DEFAULT 'active'
    );
  `);
};

exports.down = function(db) {
  return db.runSql('DROP TABLE orders;');
};

exports._meta = {
  "version": 1
};
