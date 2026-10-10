import { z } from 'zod';

export function isValidHttpUrl(string) {
  if (!string) return true;
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const projectQuerySchema = z.object({
  category: z.string().trim().optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  search: z.string().trim().optional(),
});

export const projectSlugSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase alphanumeric characters and hyphens'),
});

export const urlValidator = z
  .string()
  .refine(isValidHttpUrl, 'URL must use HTTP or HTTPS protocol and be properly formed')
  .nullable()
  .optional();

