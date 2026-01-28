import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get orders: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE id=$1';
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length === 0) {
        throw new Error(`Order with id ${id} not found`);
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get order ${id}: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [order.user_id, order.status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create order: ${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM orders WHERE id=$1 RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete order ${id}: ${err}`);
    }
  }

  async addProduct(
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<OrderProduct> {
    try {
      const orderSql = 'SELECT * FROM orders WHERE id=$1';
      const conn = await client.connect();
      const orderResult = await conn.query(orderSql, [orderId]);

      if (orderResult.rows.length === 0) {
        conn.release();
        throw new Error(`Order with id ${orderId} not found`);
      }

      const order = orderResult.rows[0];
      if (order.status !== 'active') {
        conn.release();
        throw new Error(
          `Cannot add product to order ${orderId} because order status is ${order.status}`
        );
      }

      const sql =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [orderId, productId, quantity]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot add product ${productId} to order ${orderId}: ${err}`);
    }
  }

  async getCurrentOrderByUser(userId: number): Promise<Order | null> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT * FROM orders WHERE user_id=$1 AND status=$2 ORDER BY id DESC LIMIT 1';
      const result = await conn.query(sql, [userId, 'active']);
      conn.release();
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
      throw new Error(`Cannot get current order by user ${userId}: ${err}`);
    }
  }

  async getCompletedOrdersByUser(userId: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT * FROM orders WHERE user_id=$1 AND status=$2 ORDER BY id DESC';
      const result = await conn.query(sql, [userId, 'complete']);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get completed orders by user ${userId}: ${err}`);
    }
  }
}
