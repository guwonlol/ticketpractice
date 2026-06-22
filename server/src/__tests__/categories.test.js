import Category from '../models/Category.js';
import {
  api,
  clearDatabase,
  createUserWithToken,
  createAdmin,
  createCategory,
  authHeader
} from './helpers.js';

describe('Categories', () => {
  let admin;
  let user;

  beforeEach(async () => {
    await clearDatabase();
    admin = await createAdmin({ email: 'admin@test.com' });
    user = await createUserWithToken({ name: 'User', email: 'user@test.com' });
  });

  test('admin can create category', async () => {
    const res = await api
      .post('/api/categories')
      .set(authHeader(admin.token))
      .send({ name: 'Billing', description: 'Billing issues' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Billing');

    const inDb = await Category.findById(res.body._id);
    expect(inDb).not.toBeNull();
  });

  test('non-admin cannot create category', async () => {
    const res = await api
      .post('/api/categories')
      .set(authHeader(user.token))
      .send({ name: 'Billing' });

    expect(res.status).toBe(403);
  });

  test('admin can delete category', async () => {
    const category = await createCategory('Old Category');

    const res = await api
      .delete(`/api/categories/${category._id}`)
      .set(authHeader(admin.token));

    expect(res.status).toBe(200);

    const inDb = await Category.findById(category._id);
    expect(inDb).toBeNull();
  });

  test('non-admin cannot delete category', async () => {
    const category = await createCategory('Protected Category');

    const res = await api
      .delete(`/api/categories/${category._id}`)
      .set(authHeader(user.token));

    expect(res.status).toBe(403);
  });

  test('admin can edit category', async () => {
    const category = await createCategory('Original Name');

    const res = await api
      .put(`/api/categories/${category._id}`)
      .set(authHeader(admin.token))
      .send({ name: 'Updated Name', description: 'Updated description' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.description).toBe('Updated description');
  });

  test('non-admin cannot edit category', async () => {
    const category = await createCategory('Locked Category');

    const res = await api
      .put(`/api/categories/${category._id}`)
      .set(authHeader(user.token))
      .send({ name: 'Hacked Name' });

    expect(res.status).toBe(403);
  });
});
