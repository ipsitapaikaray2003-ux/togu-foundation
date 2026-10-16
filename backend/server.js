import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Route imports
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import volunteerRoutes from './routes/volunteers.routes.js';
import enquiryRoutes from './routes/enquiries.routes.js';
import memberRoutes from './routes/members.routes.js';
import programRoutes from './routes/programs.routes.js';
import eventRoutes from './routes/events.routes.js';
import donationRoutes from './routes/donations.routes.js';
import expenseRoutes from './routes/expenses.routes.js';
import contentRoutes from './routes/content.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import teamRoutes from './routes/team.routes.js';
import reportRoutes from './routes/reports.routes.js';
import adminUserRoutes from './routes/adminUsers.routes.js';
import activityLogRoutes from './routes/activityLogs.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { autoInitializeDatabase } from './database/initDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5174,http://localhost:5173')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) || 
      origin.startsWith('http://localhost:') || 
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in deployment for ease of demo
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Root & Healthcheck endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'TOGU Foundation NGO Management Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    database: process.env.DB_NAME || 'togu_foundation',
    timestamp: new Date().toISOString()
  });
});

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'TOGU Foundation Backend API',
    database: process.env.DB_NAME || 'togu_foundation',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin-users', adminUserRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server (only if not running as serverless function on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`\n======================================================`);
    console.log(`🚀 TOGU Foundation Backend API running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🗄️ Database: ${process.env.DB_NAME || 'togu_foundation'}`);
    console.log(`======================================================\n`);

    // Auto-create schema and seed initial admin users if on a fresh cloud database
    try {
      await autoInitializeDatabase();
    } catch (e) {
      console.warn('⚠️ [AutoInit] Non-critical initialization error:', e.message);
    }
  });
}

export default app;
