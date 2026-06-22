import {
  api,
  clearDatabase,
  createUserWithToken,
  expiredToken,
  authHeader
} from './helpers.js';

describe('Middleware', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  test('request with no JWT returns 401', async () => {
    const res = await api.get('/api/requests/my-requests');

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/no token/i);
  });

  test('request with invalid JWT returns 401', async () => {
    const res = await api
      .get('/api/requests/my-requests')
      .set('Authorization', 'Bearer not-a-valid-token');

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid token/i);
  });

  test('request with expired JWT returns 401', async () => {
    const user = await createUserWithToken({ email: 'expired-user@test.com' });
    const token = expiredToken(user.user.id);

    const res = await api
      .get('/api/requests/my-requests')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid token/i);
  });

  test('user role hitting admin-only route returns 403', async () => {
    const user = await createUserWithToken({ email: 'regular@test.com' });

    const res = await api
      .get('/api/requests')
      .set(authHeader(user.token));

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/admin access required/i);
  });
});
