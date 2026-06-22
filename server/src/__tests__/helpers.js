import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import app from '../index.js';
import User from '../models/User.js';
import Request from '../models/Request.js';
import Category from '../models/Category.js';
import StatusHistory from '../models/StatusHistory.js';

export { app };
export const api = supertest(app);

export async function clearDatabase() {
  await Promise.all([
    User.deleteMany({}),
    Request.deleteMany({}),
    Category.deleteMany({}),
    StatusHistory.deleteMany({})
  ]);
}

export async function registerUser({ name = 'Test User', email, password = 'password123' } = {}) {
  const res = await api
    .post('/api/auth/register')
    .send({ name, email, password });
  return res;
}

export async function loginUser(email, password = 'password123') {
  const res = await api
    .post('/api/auth/login')
    .send({ email, password });
  return res;
}

export async function createAdmin({ name = 'Admin', email = 'admin@test.com', password = 'admin123' } = {}) {
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await User.create({ name, email, passwordHash, role: 'admin' });
  const tokenRes = await loginUser(email, password);
  return { admin, token: tokenRes.body.token };
}

export async function createUserWithToken({ name = 'User', email, password = 'password123' } = {}) {
  await registerUser({ name, email, password });
  const loginRes = await loginUser(email, password);
  return { token: loginRes.body.token, user: loginRes.body.user };
}

export async function createCategory(name = 'General', description = 'General category') {
  const category = await Category.create({ name, description });
  return category;
}

export async function createRequest(token, { title = 'Test Request', description = 'Test description', category } = {}) {
  const res = await api
    .post('/api/requests')
    .set('Authorization', `Bearer ${token}`)
    .send({ title, description, category });
  return res;
}

export function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export function expiredToken(userId, email = 'expired@test.com') {
  return jwt.sign(
    { id: userId, email, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '-1s' }
  );
}
