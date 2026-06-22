import {
  api,
  clearDatabase,
  createUserWithToken,
  createAdmin,
  createCategory,
  createRequest,
  authHeader
} from './helpers.js';

describe('Requests (user)', () => {
  let user1;
  let user2;
  let category;

  beforeEach(async () => {
    await clearDatabase();
    user1 = await createUserWithToken({ name: 'Alice', email: 'alice@test.com' });
    user2 = await createUserWithToken({ name: 'Bob', email: 'bob@test.com' });
    category = await createCategory('Support');
  });

  test('create request with valid data', async () => {
    const res = await createRequest(user1.token, {
      title: 'Need help',
      description: 'Please assist',
      category: category._id
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Need help');
    expect(res.body.status).toBe('New');
  });

  test('create request with missing required fields returns 400', async () => {
    const res = await api
      .post('/api/requests')
      .set(authHeader(user1.token))
      .send({ title: 'Missing fields' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  test('get own requests list with pagination', async () => {
    for (let i = 1; i <= 12; i += 1) {
      await createRequest(user1.token, {
        title: `Request ${i}`,
        description: `Description ${i}`,
        category: category._id
      });
    }

    const page1 = await api
      .get('/api/requests/my-requests?page=1&limit=10')
      .set(authHeader(user1.token));

    expect(page1.status).toBe(200);
    expect(page1.body.requests).toHaveLength(10);
    expect(page1.body.total).toBe(12);
    expect(page1.body.pages).toBe(2);

    const page2 = await api
      .get('/api/requests/my-requests?page=2&limit=10')
      .set(authHeader(user1.token));

    expect(page2.status).toBe(200);
    expect(page2.body.requests).toHaveLength(2);
  });

  test('get own requests filtered by status', async () => {
    const req1 = await createRequest(user1.token, {
      title: 'New request',
      category: category._id
    });
    const req2 = await createRequest(user1.token, {
      title: 'Another request',
      category: category._id
    });

    const { token: adminToken } = await createAdmin({ email: 'admin-status@test.com' });

    await api
      .patch(`/api/requests/${req2.body._id}/status`)
      .set(authHeader(adminToken))
      .send({ status: 'In Progress' });

    const filtered = await api
      .get('/api/requests/my-requests?status=New')
      .set(authHeader(user1.token));

    expect(filtered.status).toBe(200);
    expect(filtered.body.requests).toHaveLength(1);
    expect(filtered.body.requests[0]._id).toBe(req1.body._id);
  });

  test('get request by id as owner succeeds', async () => {
    const created = await createRequest(user1.token, {
      title: 'My request',
      category: category._id
    });

    const res = await api
      .get(`/api/requests/${created.body._id}`)
      .set(authHeader(user1.token));

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('My request');
  });

  test('get request by id as non-owner returns 403', async () => {
    const created = await createRequest(user1.token, {
      title: 'Private request',
      category: category._id
    });

    const res = await api
      .get(`/api/requests/${created.body._id}`)
      .set(authHeader(user2.token));

    expect(res.status).toBe(403);
  });

  test('edit own request while status is New succeeds', async () => {
    const created = await createRequest(user1.token, {
      title: 'Original title',
      description: 'Original description',
      category: category._id
    });

    const res = await api
      .put(`/api/requests/${created.body._id}`)
      .set(authHeader(user1.token))
      .send({ title: 'Updated title', description: 'Updated description' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated title');
    expect(res.body.description).toBe('Updated description');
  });

  test('edit own request while status is not New returns 403', async () => {
    const { token: adminToken } = await createAdmin({ email: 'admin-edit@test.com' });

    const created = await createRequest(user1.token, {
      title: 'Locked request',
      category: category._id
    });

    await api
      .patch(`/api/requests/${created.body._id}/status`)
      .set(authHeader(adminToken))
      .send({ status: 'In Progress' });

    const res = await api
      .put(`/api/requests/${created.body._id}`)
      .set(authHeader(user1.token))
      .send({ title: 'Should fail' });

    expect(res.status).toBe(403);
  });

  test('edit someone else request returns 403', async () => {
    const created = await createRequest(user1.token, {
      title: 'Alice request',
      category: category._id
    });

    const res = await api
      .put(`/api/requests/${created.body._id}`)
      .set(authHeader(user2.token))
      .send({ title: 'Hacked title' });

    expect(res.status).toBe(403);
  });

  test('delete own request while status is New succeeds', async () => {
    const created = await createRequest(user1.token, {
      title: 'To delete',
      category: category._id
    });

    const res = await api
      .delete(`/api/requests/${created.body._id}`)
      .set(authHeader(user1.token));

    expect(res.status).toBe(200);

    const getRes = await api
      .get(`/api/requests/${created.body._id}`)
      .set(authHeader(user1.token));

    expect(getRes.status).toBe(404);
  });

  test('delete own request while status is not New returns 403', async () => {
    const { token: adminToken } = await createAdmin({ email: 'admin-delete@test.com' });

    const created = await createRequest(user1.token, {
      title: 'Cannot delete',
      category: category._id
    });

    await api
      .patch(`/api/requests/${created.body._id}/status`)
      .set(authHeader(adminToken))
      .send({ status: 'Resolved' });

    const res = await api
      .delete(`/api/requests/${created.body._id}`)
      .set(authHeader(user1.token));

    expect(res.status).toBe(403);
  });

  test('get status history for own request', async () => {
    const { token: adminToken } = await createAdmin({ email: 'admin-history@test.com' });

    const created = await createRequest(user1.token, {
      title: 'History request',
      category: category._id
    });

    await api
      .patch(`/api/requests/${created.body._id}/status`)
      .set(authHeader(adminToken))
      .send({ status: 'In Progress' });

    const res = await api
      .get(`/api/requests/${created.body._id}/history`)
      .set(authHeader(user1.token));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].oldStatus).toBe('New');
    expect(res.body[0].newStatus).toBe('In Progress');
  });
});
