import { Router } from 'express';
import { listProjects, getProject } from '../controllers/projects.controller.js';
import { projectQuerySchema, projectSlugSchema } from '../validators/project.validator.js';
import { validateQuery, validateParams } from '../middleware/validate.middleware.js';

const router = Router();

// GET /api/projects - list published projects with optional filters
router.get(
  '/',
  validateQuery(projectQuerySchema),
  listProjects
);

// GET /api/projects/:slug - fetch project by slug
router.get(
  '/:slug',
  validateParams(projectSlugSchema),
  getProject
);

export default router;

