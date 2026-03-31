import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

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

try {
  log('🚀 Starting server...');
  log('Environment: ' + (process.env.NODE_ENV || 'development'));
  log('Database URL: ' + (process.env.DATABASE_URL ? '✅ Configured' : '❌ Not configured'));

  // Connect to database (non-blocking)
  connectDB();

  app.use(cors());
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
  app.use('/api/blogs', blogRoutes);
  app.use('/api/contact', contactRoutes);

  // Serve React static files
  // Try multiple possible locations for the build
  let buildPath = null;
  
  // Try 1: dist folder (local development)
  if (fs.existsSync(path.join(__dirname, '../dist'))) {
    buildPath = path.join(__dirname, '../dist');
    log('Found build at: ../dist');
  }
  // Try 2: public_html root (Hostinger production - files uploaded directly)
  else if (fs.existsSync(path.join(__dirname, '../index.html'))) {
    buildPath = path.join(__dirname, '..');
    log('Found build at: parent directory (Hostinger)');
  }
  // Try 3: Current directory
  else if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    buildPath = __dirname;
    log('Found build at: current directory');
  }
  
  const indexPath = buildPath ? path.join(buildPath, 'index.html') : null;
  const indexExists = indexPath && fs.existsSync(indexPath);

  log('Build path: ' + (buildPath || 'NOT FOUND'));
  log('index.html exists: ' + (indexExists ? '✅' : '❌'));

  if (indexExists) {
    // Serve static assets
    app.use(express.static(buildPath));
    log('✅ Serving frontend from dist/');
    
    // Catch all - serve index.html for client-side routing (use middleware, not app.get('*'))
    app.use((req, res) => {
      // Don't intercept API routes
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(indexPath);
    });
  } else {
    log('❌ Frontend files not found - serving API only');
    
    // Minimal fallback - use middleware, not app.get('*')
    app.use((req, res) => {
      res.status(503).json({ error: 'Server temporarily unavailable' });
    });
  }

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, '0.0.0.0', () => {
    log('✅ Server running on port ' + PORT);
    log('🌐 Visit http://localhost:' + PORT);
  });

} catch (error) {
  logError('Failed to start server', error);
  process.exit(1);
}
