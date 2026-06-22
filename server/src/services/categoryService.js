import Category from '../models/Category.js';

export const createCategory = async (name, description = '') => {
  const category = new Category({ name, description });
  await category.save();
  return category;
};

export const getCategories = async () => {
  return Category.find().sort({ createdAt: 1 });
};

export const getCategoryById = async (id) => {
  return Category.findById(id);
};

export const updateCategory = async (id, updates) => {
  return Category.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteCategory = async (id) => {
  await Category.deleteOne({ _id: id });
};
