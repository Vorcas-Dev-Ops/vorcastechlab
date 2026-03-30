import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting server...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Database URL:', process.env.DATABASE_URL ? '✅ Configured' : '❌ Not configured');

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
const buildPath = path.join(__dirname, '../dist');
console.log('Serving static files from:', buildPath);

app.use(express.static(buildPath));

// SPA fallback - serve index.html for non-API routes
app.use((req, res, next) => {
  // Skip API routes and requests with file extensions
  if (req.path.startsWith('/api') || /\.\w+$/.test(req.path)) {
    return next();
  }
  
  // For all other requests, serve index.html (SPA routing)
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Page not found' });
    }
  });
});

// 404 handler for API routes that don't exist
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Visit http://localhost:${PORT}`);
});
