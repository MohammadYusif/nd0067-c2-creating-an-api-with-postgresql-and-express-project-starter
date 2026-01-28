import { Order, OrderStore } from '../models/order';
import { User, UserStore } from '../models/user';
import { Product, ProductStore } from '../models/product';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Model', () => {
  let createdOrderId: number;
  let testUserId: number;
  let testProductId: number;

  beforeAll(async () => {
    const user: User = {
      first_name: 'Test',
      last_name: 'User',
      password: 'testpass'
    };
    const createdUser = await userStore.create(user);
    testUserId = createdUser.id as number;

    const product: Product = {
      name: 'Test Product',
      price: 19.99,
      category: 'Test'
    };
    const createdProduct = await productStore.create(product);
    testProductId = createdProduct.id as number;
  });

  afterAll(async () => {
    await userStore.delete(testUserId);
    await productStore.delete(testProductId);
  });

  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(orderStore.delete).toBeDefined();
  });

  it('should have an addProduct method', () => {
    expect(orderStore.addProduct).toBeDefined();
  });

  it('should have a getCurrentOrderByUser method', () => {
    expect(orderStore.getCurrentOrderByUser).toBeDefined();
  });

  it('should have a getCompletedOrdersByUser method', () => {
    expect(orderStore.getCompletedOrdersByUser).toBeDefined();
  });

  it('create method should add an order', async () => {
    const order: Order = {
      user_id: testUserId,
      status: 'active'
    };
    const result = await orderStore.create(order);
    createdOrderId = result.id as number;
    expect(result.user_id).toBe(testUserId);
    expect(result.status).toBe('active');
    expect(result.id).toBeDefined();
  });

  it('index method should return a list of orders', async () => {
    const result = await orderStore.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct order', async () => {
    const result = await orderStore.show(createdOrderId);
    expect(result.id).toBe(createdOrderId);
    expect(result.user_id).toBe(testUserId);
  });

  it('addProduct method should add a product to an order', async () => {
    const result = await orderStore.addProduct(createdOrderId, testProductId, 2);
    expect(result.order_id).toBe(createdOrderId);
    expect(result.product_id).toBe(testProductId);
    expect(result.quantity).toBe(2);
  });

  it('getCurrentOrderByUser method should return the current active order', async () => {
    const result = await orderStore.getCurrentOrderByUser(testUserId);
    expect(result).not.toBeNull();
    expect(result?.user_id).toBe(testUserId);
    expect(result?.status).toBe('active');
  });

  it('getCompletedOrdersByUser method should return completed orders', async () => {
    const result = await orderStore.getCompletedOrdersByUser(testUserId);
    expect(Array.isArray(result)).toBe(true);
  });

  it('delete method should remove the order', async () => {
    const result = await orderStore.delete(createdOrderId);
    expect(result.id).toBe(createdOrderId);
  });
});
