import env from '../config/env.js';

// Not Found Handler
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Global Error Handler
export function errorHandler(err, req, res, next) {
  // Never log sensitive contents like passwords, tokens, or personal message bodies
  const safeLogInfo = {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    name: err.name,
    message: err.message,
  };

  if (env.NODE_ENV !== 'test') {
    console.error('⚠️ [API Error]:', safeLogInfo);
    if (env.NODE_ENV !== 'production' && err.stack) {
      console.error(err.stack);
    }
  }

  // Handle CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: CORS policy restriction',
    });
  }

  // Handle Prisma unique constraint error
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'A resource with this identifier already exists',
    });
  }

  // Handle Prisma not found error
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Requested resource not found',
    });
  }

  // Handle database connection failure
  if (err.code === 'P1001' || err.code === 'P1002' || err.name === 'PrismaClientInitializationError') {
    return res.status(503).json({
      success: false,
      error: 'Service temporarily unavailable: database connection error',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500 ? 'Internal Server Error' : err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

