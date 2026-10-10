import { getPublishedProjects, getProjectBySlug } from '../services/projects.service.js';

export async function listProjects(req, res, next) {
  try {
    const { category, featured, search } = req.query;
    const projects = await getPublishedProjects({ category, featured, search });

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProject(req, res, next) {
  try {
    const { slug } = req.params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: `Project with slug '${slug}' not found`,
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
}

