import { User, UserStore } from '../models/user';

const store = new UserStore();

describe('User Model', () => {
  let createdUserId: number;

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a user', async () => {
    const user: User = {
      first_name: 'John',
      last_name: 'Doe',
      password: 'password123'
    };
    const result = await store.create(user);
    createdUserId = result.id as number;
    expect(result.first_name).toBe('John');
    expect(result.last_name).toBe('Doe');
    expect(result.id).toBeDefined();
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show(createdUserId);
    expect(result.id).toBe(createdUserId);
    expect(result.first_name).toBe('John');
    expect(result.last_name).toBe('Doe');
  });

  it('authenticate method should authenticate a user with correct credentials', async () => {
    const result = await store.authenticate('John', 'Doe', 'password123');
    expect(result).not.toBeNull();
    expect(result?.first_name).toBe('John');
    expect(result?.last_name).toBe('Doe');
  });

  it('authenticate method should return null for incorrect credentials', async () => {
    const result = await store.authenticate('John', 'Doe', 'wrongpassword');
    expect(result).toBeNull();
  });

  it('delete method should remove the user', async () => {
    const result = await store.delete(createdUserId);
    expect(result.id).toBe(createdUserId);
  });
});
