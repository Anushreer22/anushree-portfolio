import { z } from 'zod';
import { sanitizeString } from './contact.validator.js';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

export const updateMessageSchema = z.object({
  status: z.enum(['UNREAD', 'READ', 'ARCHIVED'], {
    errorMap: () => ({ message: 'Status must be one of: UNREAD, READ, ARCHIVED' }),
  }),
  adminNotes: z
    .string()
    .transform(sanitizeString)
    .pipe(z.string().max(1000, 'Admin notes cannot exceed 1000 characters'))
    .optional(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(['UNREAD', 'READ', 'ARCHIVED']).optional(),
  search: z.string().trim().optional(),
});

