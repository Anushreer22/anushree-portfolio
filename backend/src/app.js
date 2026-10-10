import express from 'express';
import { helmetMiddleware, corsMiddleware, timeoutMiddleware } from './middleware/security.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';

const app = express();

// Trust reverse proxy (essential for Render, Vercel, Heroku, etc.)
app.set('trust proxy', 1);

// HTTP Security Headers
app.use(helmetMiddleware);

// Strict CORS with explicit frontend-origin allowlist
app.use(corsMiddleware);

// Request Timeout (30s)
app.use(timeoutMiddleware(30));

// Request Body Parsers with tight size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply general API rate limiting
app.use('/api', apiLimiter);

// Root landing endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Anushree R Portfolio API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      projects: 'GET /api/projects',
      contact: 'POST /api/contact',
      admin: '/api/admin/*',
    },
  });
});

// API Routes
app.use('/api', apiRouter);

// 404 Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;

