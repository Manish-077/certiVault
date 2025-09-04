import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


// Routes
import authRouter from './routes/auth.js';
import certRouter from './routes/certificateRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config(); // ✅ load .env

// Setup
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Debug: check if env is loading
console.log("Loaded MONGO_URI:", MONGO_URI ? "✅ Found" : "❌ Missing");

// Middleware
app.use(helmet());
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'YOUR_FRONTEND_URL' // Replace with your actual frontend URL in .env
    : 'http://localhost:3000', // For development
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Debugging middleware - logs all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// MongoDB connection
mongoose.connect(MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/certificates', certRouter);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);


// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
