import User from '../models/User.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
});
