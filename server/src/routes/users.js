import express from 'express';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';
import * as controller from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', verifyToken, controller.getProfile);
router.get('/', verifyToken, requireAdmin, controller.getUsers);

export default router;
