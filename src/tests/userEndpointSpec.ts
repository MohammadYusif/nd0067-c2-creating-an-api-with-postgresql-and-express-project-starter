import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('User Endpoints', () => {
  let token: string;
  let userId: number;

  it('POST /users should create a new user', async () => {
    const response = await request.post('/users').send({
      first_name: 'Jane',
      last_name: 'Smith',
      password: 'password456'
    });
    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();
    userId = response.body.user.id;
    token = response.body.token;
  });

  it('POST /users/authenticate should authenticate a user', async () => {
    const response = await request.post('/users/authenticate').send({
      first_name: 'Jane',
      last_name: 'Smith',
      password: 'password456'
    });
    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();
  });

  it('POST /users/authenticate should fail with incorrect password', async () => {
    const response = await request.post('/users/authenticate').send({
      first_name: 'Jane',
      last_name: 'Smith',
      password: 'wrongpassword'
    });
    expect(response.status).toBe(401);
  });

  it('GET /users should require authentication', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });

  it('GET /users should return a list of users with token', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /users/:id should require authentication', async () => {
    const response = await request.get(`/users/${userId}`);
    expect(response.status).toBe(401);
  });

  it('GET /users/:id should return a specific user with token', async () => {
    const response = await request
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.first_name).toBe('Jane');
  });
});
