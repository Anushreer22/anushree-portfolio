import { Router } from 'express';
import {
  adminLogin,
  getAdminProfile,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
} from '../controllers/admin.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateBody, validateQuery } from '../middleware/validate.middleware.js';
import {
  loginSchema,
  updateMessageSchema,
  paginationQuerySchema,
} from '../validators/admin.validator.js';

const router = Router();

// Public Admin Auth with rate limiting (no public registration exists)
router.post('/auth/login', authLimiter, validateBody(loginSchema), adminLogin);

// Protected Admin Routes
router.use(requireAdminAuth);

router.get('/auth/me', getAdminProfile);
router.get('/messages', validateQuery(paginationQuerySchema), getMessages);
router.get('/messages/:id', getMessage);
router.patch('/messages/:id', validateBody(updateMessageSchema), updateMessage);
router.delete('/messages/:id', deleteMessage);

export default router;

