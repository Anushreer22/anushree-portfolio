import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

// General API Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.',
  },
  skip: (req) => process.env.DISABLE_RATE_LIMIT === 'true',
});

// Contact Form Rate Limiter (stricter: e.g. 5 submissions per 15 minutes)
export const contactLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_CONTACT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many contact messages sent from this IP. Please wait a few minutes before trying again.',
  },
  skip: (req) => process.env.DISABLE_RATE_LIMIT === 'true',
});

// Admin Auth Rate Limiter (prevents brute force logins)
export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. Account temporarily locked for 15 minutes.',
  },
  skip: (req) => process.env.DISABLE_RATE_LIMIT === 'true',
});

