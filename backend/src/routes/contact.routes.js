import { Router } from 'express';
import { submitContactForm } from '../controllers/contact.controller.js';
import { contactFormSchema } from '../validators/contact.validator.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { contactLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.post(
  '/',
  contactLimiter,
  validateBody(contactFormSchema),
  submitContactForm
);

export default router;

