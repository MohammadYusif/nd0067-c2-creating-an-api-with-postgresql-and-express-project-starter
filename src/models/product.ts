import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error(`Product with id ${id} not found`);
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get product ${id}: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category || null
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create product ${product.name}: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM products WHERE id=$1 RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete product ${id}: ${err}`);
    }
  }

  async getByCategory(category: string): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM products WHERE category=$1';
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products by category ${category}: ${err}`);
    }
  }
}
