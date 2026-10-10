import { z } from 'zod';

// Helper to strip control characters and dangerous HTML script tags
export function sanitizeString(val) {
  if (typeof val !== 'string') return val;
  return val
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // remove ASCII control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip script tags
    .trim();
}

export const contactFormSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .transform(sanitizeString)
    .pipe(
      z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
    ),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address')
    .max(255, 'Email must not exceed 255 characters'),

  subject: z
    .string({ required_error: 'Subject is required' })
    .transform(sanitizeString)
    .pipe(
      z
        .string()
        .min(2, 'Subject must be at least 2 characters')
        .max(150, 'Subject must not exceed 150 characters')
    ),

  message: z
    .string({ required_error: 'Message is required' })
    .transform(sanitizeString)
    .pipe(
      z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(3000, 'Message must not exceed 3000 characters')
    ),

  // Honeypot fields for bot detection
  _gotcha: z.string().optional().default(''),
  honeypot: z.string().optional().default(''),
});

