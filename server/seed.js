import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Проверяем есть ли уже админ
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Админ уже существует:', existingAdmin.email);
      await mongoose.disconnect();
      return;
    }

    // Создаём админа
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Админ создан успешно!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

seedAdmin();
