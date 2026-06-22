import express from 'express';
import { body } from 'express-validator';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';
import * as controller from '../controllers/categoryController.js';

const router = express.Router();

// Public read
router.get('/', controller.getCategories);
router.get('/:id', controller.getCategory);

// Admin write
router.post('/', verifyToken, requireAdmin, [
  body('name').notEmpty().withMessage('Name is required')
], controller.createCategory);

router.put('/:id', verifyToken, requireAdmin, controller.updateCategory);
router.delete('/:id', verifyToken, requireAdmin, controller.deleteCategory);

export default router;
