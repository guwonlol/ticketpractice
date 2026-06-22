import * as categoryService from '../services/categoryService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { validationResult } from 'express-validator';

export const createCategory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description } = req.body;
  const category = await categoryService.createCategory(name, description);
  res.status(201).json(category);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();
  res.json(categories);
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.json({ message: 'Category deleted' });
});
