import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('Order Endpoints', () => {
  let token: string;
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    const userResponse = await request.post('/users').send({
      first_name: 'OrderTest',
      last_name: 'User',
      password: 'testpass'
    });
    token = userResponse.body.token;
    userId = userResponse.body.user.id;

    const productResponse = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        price: 49.99,
        category: 'Test'
      });
    productId = productResponse.body.id;
  });

  it('POST /orders should require authentication', async () => {
    const response = await request.post('/orders').send({
      user_id: userId,
      status: 'active'
    });
    expect(response.status).toBe(401);
  });

  it('POST /orders should create a new order with token', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: userId,
        status: 'active'
      });
    expect(response.status).toBe(200);
    expect(response.body.user_id).toBe(userId);
    expect(response.body.status).toBe('active');
    orderId = response.body.id;
  });

  it('GET /orders should require authentication', async () => {
    const response = await request.get('/orders');
    expect(response.status).toBe(401);
  });

  it('GET /orders should return a list of orders with token', async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /orders/:id should require authentication', async () => {
    const response = await request.get(`/orders/${orderId}`);
    expect(response.status).toBe(401);
  });

  it('GET /orders/:id should return a specific order with token', async () => {
    const response = await request
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(orderId);
  });

  it('POST /orders/:id/products should require authentication', async () => {
    const response = await request.post(`/orders/${orderId}/products`).send({
      product_id: productId,
      quantity: 3
    });
    expect(response.status).toBe(401);
  });

  it('POST /orders/:id/products should add a product to order with token', async () => {
    const response = await request
      .post(`/orders/${orderId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_id: productId,
        quantity: 3
      });
    expect(response.status).toBe(200);
    expect(response.body.order_id).toBe(orderId);
    expect(response.body.product_id).toBe(productId);
    expect(response.body.quantity).toBe(3);
  });

  it('GET /orders/user/:userId/current should require authentication', async () => {
    const response = await request.get(`/orders/user/${userId}/current`);
    expect(response.status).toBe(401);
  });

  it('GET /orders/user/:userId/current should return current order with token', async () => {
    const response = await request
      .get(`/orders/user/${userId}/current`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('GET /orders/user/:userId/completed should require authentication', async () => {
    const response = await request.get(`/orders/user/${userId}/completed`);
    expect(response.status).toBe(401);
  });

  it('GET /orders/user/:userId/completed should return completed orders with token', async () => {
    const response = await request
      .get(`/orders/user/${userId}/completed`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
