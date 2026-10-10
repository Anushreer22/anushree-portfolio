import { Router } from 'express';
import healthRoutes from './health.routes.js';
import contactRoutes from './contact.routes.js';
import projectsRoutes from './projects.routes.js';
import adminRoutes from './admin.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/projects', projectsRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;

