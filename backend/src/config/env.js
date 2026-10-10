import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // CORS origin(s) - split comma-separated strings into an array
  CORS_ORIGIN: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-do-not-use-in-production-min-32-chars-long!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',

  // Resend Email
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || 'anushreer695@gmail.com',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MINUTES: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  RATE_LIMIT_CONTACT_MAX: parseInt(process.env.RATE_LIMIT_CONTACT_MAX || '5', 10),
  RATE_LIMIT_AUTH_MAX: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5', 10),

  // Initial Admin
  INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL || '',
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD || '',
  INITIAL_ADMIN_NAME: process.env.INITIAL_ADMIN_NAME || 'Anushree R',
};

// Security warning if running production with default secret
if (env.NODE_ENV === 'production' && env.JWT_SECRET.includes('dev-jwt-secret')) {
  console.warn('⚠️ [SECURITY WARNING] Default JWT_SECRET is being used in production! Please set a strong random secret.');
}

export default env;

