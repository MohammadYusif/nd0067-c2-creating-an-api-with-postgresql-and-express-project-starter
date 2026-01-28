import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('Product Endpoints', () => {
  let token: string;
  let productId: number;

  beforeAll(async () => {
    const response = await request.post('/users').send({
      first_name: 'ProductTest',
      last_name: 'User',
      password: 'testpass'
    });
    token = response.body.token;
  });

  it('POST /products should require authentication', async () => {
    const response = await request.post('/products').send({
      name: 'Laptop',
      price: 999.99,
      category: 'Electronics'
    });
    expect(response.status).toBe(401);
  });

  it('POST /products should create a new product with token', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Laptop',
        price: 999.99,
        category: 'Electronics'
      });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Laptop');
    expect(parseFloat(response.body.price)).toBe(999.99);
    productId = response.body.id;
  });

  it('GET /products should return a list of products', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /products/:id should return a specific product', async () => {
    const response = await request.get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe('Laptop');
  });

  it('GET /products/category/:category should return products by category', async () => {
    const response = await request.get('/products/category/Electronics');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0].category).toBe('Electronics');
    }
  });
});
