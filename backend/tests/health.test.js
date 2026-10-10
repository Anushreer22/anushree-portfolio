import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import * as prismaConfig from '../src/config/prisma.js';

describe('GET /api/health', () => {
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: vi.fn().mockResolvedValue([{ 1: 1 }]),
    };
    prismaConfig.setPrismaClient(mockPrisma);
  });

  it('should return 200 OK and healthy status when database is reachable', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database.status).toBe('connected');
    expect(res.body.uptime).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });

  it('should return 503 Service Unavailable when database query fails', async () => {
    mockPrisma.$queryRaw = vi.fn().mockRejectedValue(new Error('DB Connection Refused'));

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(503);
    expect(res.body.status).toBe('degraded');
    expect(res.body.database.status).toBe('error');
  });
});

