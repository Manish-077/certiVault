import User from '../models/User.js';
import { signToken } from '../../middleware/authMiddleware.js';

export const registerUser = async (req, res, next) => {
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
    next(e); // Pass errors to the global error handler
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id.toString(), email: user.email } });
  } catch (e) {
    next(e); // Pass errors to the global error handler
  }
};

export const verifyToken = (req, res) => {
  res.json({ ok: true, user: req.user });
};
