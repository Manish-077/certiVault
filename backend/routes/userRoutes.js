import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getMe, updateMe, getPublicProfile } from '../src/controllers/userController.js';

const router = express.Router();

router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.get('/:userId/public', getPublicProfile);

export default router;
