import express from 'express';
import User from '../src/models/User.js';
import { signToken, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ email, passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id.toString(), email: user.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id.toString(), email: user.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/verify-token', authMiddleware, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;


