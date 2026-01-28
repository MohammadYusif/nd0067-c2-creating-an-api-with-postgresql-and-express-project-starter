const { query } = require('db-migrate-base');

exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE order_products (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1
    );
  `);
};

exports.down = function(db) {
  return db.runSql('DROP TABLE order_products;');
};

exports._meta = {
  "version": 1
};
