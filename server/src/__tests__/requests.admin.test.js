import StatusHistory from '../models/StatusHistory.js';
import {
  api,
  clearDatabase,
  createUserWithToken,
  createAdmin,
  createCategory,
  createRequest,
  authHeader
} from './helpers.js';

describe('Requests (admin)', () => {
  let admin;
  let user1;
  let user2;
  let category;

  beforeEach(async () => {
    await clearDatabase();
    admin = await createAdmin({ email: 'admin@test.com' });
    user1 = await createUserWithToken({ name: 'Alice', email: 'alice@test.com' });
    user2 = await createUserWithToken({ name: 'Bob', email: 'bob@test.com' });
    category = await createCategory('Support');
  });

  test('admin gets all requests regardless of owner', async () => {
    await createRequest(user1.token, { title: 'Alice request', category: category._id });
    await createRequest(user2.token, { title: 'Bob request', category: category._id });

    const res = await api
      .get('/api/requests')
      .set(authHeader(admin.token));

    expect(res.status).toBe(200);
    expect(res.body.requests).toHaveLength(2);
    const titles = res.body.requests.map((r) => r.title);
    expect(titles).toContain('Alice request');
    expect(titles).toContain('Bob request');
  });

  test('admin changes status via PATCH and history entry is created', async () => {
    const created = await createRequest(user1.token, {
      title: 'Status change test',
      category: category._id
    });

    const patchRes = await api
      .patch(`/api/requests/${created.body._id}/status`)
      .set(authHeader(admin.token))
      .send({ status: 'In Progress' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.status).toBe('In Progress');

    const history = await StatusHistory.find({ requestId: created.body._id });
    expect(history).toHaveLength(1);
    expect(history[0].oldStatus).toBe('New');
    expect(history[0].newStatus).toBe('In Progress');
    expect(history[0].changedBy.toString()).toBe(admin.admin._id.toString());
  });

  test('non-admin changing status returns 403', async () => {
    const created = await createRequest(user1.token, {
      title: 'Protected status',
      category: category._id
    });

    const res = await api
      .patch(`/api/requests/${created.body._id}/status`)
      .set(authHeader(user2.token))
      .send({ status: 'In Progress' });

    expect(res.status).toBe(403);
  });

  test('statistics endpoint returns correct counts', async () => {
    const r1 = await createRequest(user1.token, { title: 'R1', category: category._id });
    const r2 = await createRequest(user1.token, { title: 'R2', category: category._id });
    await createRequest(user2.token, { title: 'R3', category: category._id });
    await createRequest(user2.token, { title: 'R4', category: category._id });

    await api
      .patch(`/api/requests/${r1.body._id}/status`)
      .set(authHeader(admin.token))
      .send({ status: 'In Progress' });

    await api
      .patch(`/api/requests/${r2.body._id}/status`)
      .set(authHeader(admin.token))
      .send({ status: 'Resolved' });

    const res = await api.get('/api/requests/statistics');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4);
    expect(res.body.byStatus['New']).toBe(2);
    expect(res.body.byStatus['In Progress']).toBe(1);
    expect(res.body.byStatus['Resolved']).toBe(1);
  });
});
