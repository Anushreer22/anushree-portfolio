import helmet from 'helmet';
import cors from 'cors';
import env from '../config/env.js';

// Helmet Security Headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Strict CORS with explicit frontend-origin allowlist
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (like curl, server-to-server, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = Array.isArray(env.CORS_ORIGIN) ? env.CORS_ORIGIN : [env.CORS_ORIGIN];

    // Check exact matches
    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed === '*') return true;
      if (allowed === origin) return true;
      // Allow Vercel preview deployments if base domain is configured
      if (allowed.includes('vercel.app') && origin.endsWith('.vercel.app')) {
        return true;
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin '${origin}' is not allowed by Access-Control-Allow-Origin.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours preflight cache
});

// Request Timeout Middleware
export function timeoutMiddleware(seconds = 30) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          error: 'Gateway Timeout: Request took too long to process.',
        });
      }
    }, seconds * 1000);

    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));
    next();
  };
}

