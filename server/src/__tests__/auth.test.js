import {
  clearDatabase,
  registerUser,
  loginUser
} from './helpers.js';

describe('Auth Routes', () => {
  afterEach(async () => {
    await clearDatabase();
  });

  test('register success', async () => {
    const res = await registerUser({
      name: 'John Doe',
      email: 'john@example.com'
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('john@example.com');
    expect(res.body.user.role).toBe('user');
  });

  test('register with duplicate email returns 409', async () => {
    await registerUser({ name: 'John Doe', email: 'john@example.com' });

    const res = await registerUser({ name: 'Jane Doe', email: 'john@example.com' });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toMatch(/already registered/i);
  });

  test('register with invalid email returns 400', async () => {
    const res = await registerUser({
      name: 'John Doe',
      email: 'not-an-email'
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('register with short password returns 400', async () => {
    const res = await registerUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345'
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('login success returns token', async () => {
    await registerUser({ name: 'John Doe', email: 'john@example.com' });

    const res = await loginUser('john@example.com');

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('john@example.com');
  });

  test('login with wrong password returns 401', async () => {
    await registerUser({ name: 'John Doe', email: 'john@example.com' });

    const res = await loginUser('john@example.com', 'wrongpassword');

    expect(res.status).toBe(401);
    expect(res.body.error.message).toMatch(/invalid email or password/i);
  });
});
