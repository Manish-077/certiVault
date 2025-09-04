import express from 'express';
import { registerUser, loginUser, verifyToken } from '../src/controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/verify-token', authMiddleware, verifyToken);

export default router;


