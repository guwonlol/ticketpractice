import express from 'express';
import { body } from 'express-validator';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';
import * as controller from '../controllers/requestController.js';

const router = express.Router();

// Public stats
router.get('/statistics', controller.getStatistics);

// User routes
router.post('/', verifyToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required')
], controller.createRequest);

router.get('/my-requests', verifyToken, controller.getMyRequests);
router.get('/:id', verifyToken, controller.getRequest);
router.put('/:id', verifyToken, controller.updateRequest);
router.delete('/:id', verifyToken, controller.deleteRequest);
router.get('/:id/history', verifyToken, controller.getStatusHistory);

// Admin routes
router.get('/', verifyToken, requireAdmin, controller.getAllRequests);
router.patch('/:id/status', verifyToken, requireAdmin, [
  body('status').isIn(['New', 'In Progress', 'Resolved', 'Rejected']).withMessage('Invalid status')
], controller.changeStatus);

export default router;
