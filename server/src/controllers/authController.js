import { registerUser, loginUser } from '../services/authService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { validationResult } from 'express-validator';

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
  res.status(201).json({ message: 'User registered successfully', user });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const result = await loginUser(email, password);
  res.json(result);
});
