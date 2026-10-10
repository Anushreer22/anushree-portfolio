import prisma from '../config/prisma.js';

export async function getPublishedProjects({ category, featured, search } = {}) {
  const where = {
    published: true,
  };

  if (category && category !== 'All') {
    where.category = {
      contains: category,
      mode: 'insensitive',
    };
  }

  if (typeof featured === 'boolean') {
    where.featured = featured;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: [
      { featured: 'desc' },
      { number: 'asc' },
      { createdAt: 'desc' },
    ],
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      stack: true,
      details: true,
      githubUrl: true,
      liveDemoUrl: true,
      featured: true,
      published: true,
      accent: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return projects;
}

export async function getProjectBySlug(slug) {
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      stack: true,
      details: true,
      githubUrl: true,
      liveDemoUrl: true,
      featured: true,
      published: true,
      accent: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return project;
}

