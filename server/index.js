import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log function that writes to both console and file
const logFile = path.join(logsDir, 'server.log');
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage + '\n', { flag: 'a' });
};

const logError = (message, error) => {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ERROR: ${message}\n${error.stack || error.message || error}\n`;
  console.error(errorMessage);
  fs.appendFileSync(logFile, errorMessage, { flag: 'a' });
};

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  if (!adminEmail || !adminPassword) {
    log('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD is not set. Skipping admin user creation.');
    return;
  }

  const existingUser = await User.findOne({ where: { email: adminEmail } });
  if (!existingUser) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      isAdmin: true,
    });
    log(`✅ Default admin created: ${adminEmail}`);
  } else if (!existingUser.isAdmin) {
    existingUser.isAdmin = true;
    await existingUser.save();
    log(`✅ User ${adminEmail} updated to admin access.`);
  } else {
    log(`✅ Admin user already exists: ${adminEmail}`);
  }
};

const startServer = async () => {
  try {
    log('🚀 Starting server...');
    log('Environment: ' + (process.env.NODE_ENV || 'development'));
    log('Database URL: ' + (process.env.DATABASE_URL ? '✅ Configured' : '❌ Not configured'));

    await connectDB();
    await ensureAdminUser();

    app.use(compression());

    const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { message: 'Too many requests from this IP, please try again later.' },
      skipFailedRequests: true,
    });

    app.use(cors());
    app.use('/api', apiLimiter);
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/users', userRoutes);

  // Error handling middleware for JSON API errors
  app.use((err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
    res.status(statusCode).json({
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    });
  });

  // Serve React static files from dist folder
  const buildPath = path.join(__dirname, '../dist');
  const indexPath = path.join(buildPath, 'index.html');
  const indexExists = fs.existsSync(indexPath);

  log('Build path: ' + buildPath);
  log('index.html path: ' + indexPath);
  log('index.html exists: ' + (indexExists ? '✅' : '❌'));

  // Serve all static files from dist directory with caching for static assets
  app.use(express.static(buildPath, { maxAge: '1d', immutable: true }));
  log('✅ Static file serving configured');

  // SPA fallback - serve index.html for non-API routes
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // For all other routes, try to serve index.html
    if (!indexExists) {
      log('❌ index.html not found at: ' + indexPath);
      return res.status(503).json({ error: 'Frontend not available' });
    }
    
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(indexPath, (err) => {
      if (err) {
        logError('Failed to send index.html', err);
        res.status(500).json({ error: 'Failed to load page' });
      }
    });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, '0.0.0.0', () => {
    log('✅ Server running on port ' + PORT);
    log('🌐 Visit http://localhost:' + PORT);
  });

  return true;

} catch (error) {
  logError('Failed to start server', error);
  process.exit(1);
}
};

startServer();
