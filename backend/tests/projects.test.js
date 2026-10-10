import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import * as prismaConfig from '../src/config/prisma.js';

describe('Projects API (/api/projects)', () => {
  let mockPrisma;

  const mockProjectList = [
    {
      id: 'proj_1',
      number: '01',
      slug: 'all-india-villages-api',
      title: 'All India Villages API',
      category: 'APIs · FULL STACK',
      description: 'A searchable API platform for Indian villages.',
      stack: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
      details: ['457K+ village records', 'API-key authentication'],
      githubUrl: null,
      liveDemoUrl: null,
      featured: true,
      published: true,
      accent: 'violet',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
    },
    {
      id: 'proj_2',
      number: '02',
      slug: 'ai-health-diagnostics',
      title: 'AI Health Diagnostics',
      category: 'AI · HEALTHCARE',
      description: 'A full-stack health analytics platform.',
      stack: ['Python', 'Flask'],
      details: ['3-model pipeline'],
      githubUrl: null,
      liveDemoUrl: null,
      featured: false,
      published: true,
      accent: 'pink',
      createdAt: new Date('2026-02-01T00:00:00Z'),
      updatedAt: new Date('2026-02-01T00:00:00Z'),
    },
  ];

  beforeEach(() => {
    mockPrisma = {
      project: {
        findMany: vi.fn().mockResolvedValue(mockProjectList),
        findUnique: vi.fn().mockImplementation(({ where }) => {
          const match = mockProjectList.find((p) => p.slug === where.slug);
          return Promise.resolve(match || null);
        }),
      },
    };
    prismaConfig.setPrismaClient(mockPrisma);
  });

  it('GET /api/projects should return published projects list', async () => {
    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data[0].slug).toBe('all-india-villages-api');
    expect(mockPrisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ published: true }),
      })
    );
  });

  it('GET /api/projects/:slug should return a single project', async () => {
    const res = await request(app).get('/api/projects/all-india-villages-api');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('All India Villages API');
  });

  it('GET /api/projects/:slug should return 404 for non-existent slug', async () => {
    const res = await request(app).get('/api/projects/non-existent-project');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('not found');
  });

  it('GET /api/projects/:slug should reject malformed slugs with 400 Bad Request', async () => {
    const res = await request(app).get('/api/projects/Invalid_SLUG_With_Caps!');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

