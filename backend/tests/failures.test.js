import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import * as prismaConfig from '../src/config/prisma.js';

describe('Resilience and Failure Handling', () => {
  it('should return 503 without leaking credentials when database is disconnected', async () => {
    const dbError = new Error('Connection failed');
    dbError.code = 'P1001';

    const mockPrisma = {
      project: {
        findMany: vi.fn().mockRejectedValue(dbError),
      },
    };
    prismaConfig.setPrismaClient(mockPrisma);

    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('database connection error');
    // Ensure stack trace or credentials are not leaked
    expect(JSON.stringify(res.body)).not.toContain('postgresql://');
  });

  it('should handle unhandled controller exceptions gracefully with 500', async () => {
    const mockPrisma = {
      project: {
        findMany: vi.fn().mockRejectedValue(new Error('Unexpected disk read error')),
      },
    };
    prismaConfig.setPrismaClient(mockPrisma);

    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });
});

