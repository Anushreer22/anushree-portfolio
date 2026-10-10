import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import * as prismaConfig from '../src/config/prisma.js';
import env from '../src/config/env.js';

describe('Admin Management API (/api/admin)', () => {
  let mockPrisma;
  let sampleAdmin;
  let validToken;

  beforeEach(async () => {
    const passwordHash = await bcrypt.hash('CorrectPassword123!', 10);
    sampleAdmin = {
      id: 'admin_1',
      email: 'admin@anushreer.dev',
      name: 'Anushree R',
      passwordHash,
      role: 'ADMIN',
    };

    validToken = jwt.sign(
      { id: sampleAdmin.id, email: sampleAdmin.email, role: sampleAdmin.role },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    mockPrisma = {
      adminUser: {
        findUnique: vi.fn().mockImplementation(({ where }) => {
          if (where.email === sampleAdmin.email || where.id === sampleAdmin.id) {
            return Promise.resolve(sampleAdmin);
          }
          return Promise.resolve(null);
        }),
        update: vi.fn().mockResolvedValue(sampleAdmin),
      },
      contactMessage: {
        count: vi.fn().mockResolvedValue(1),
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'msg_1',
            name: 'Alice',
            email: 'alice@example.com',
            subject: 'Project inquiry',
            message: 'Hello Anushree',
            status: 'UNREAD',
            emailSent: true,
            createdAt: new Date(),
          },
        ]),
        findUnique: vi.fn().mockResolvedValue({
          id: 'msg_1',
          name: 'Alice',
          email: 'alice@example.com',
          subject: 'Project inquiry',
          message: 'Hello Anushree',
          status: 'UNREAD',
          emailSent: true,
          createdAt: new Date(),
        }),
        update: vi.fn().mockImplementation(({ where, data }) =>
          Promise.resolve({
            id: where.id,
            status: data.status,
            adminNotes: data.adminNotes,
          })
        ),
        delete: vi.fn().mockResolvedValue({ id: 'msg_1' }),
      },
    };

    prismaConfig.setPrismaClient(mockPrisma);
  });

  describe('Authentication (POST /api/admin/auth/login)', () => {
    it('should authenticate admin and return JWT token on correct credentials', async () => {
      const res = await request(app).post('/api/admin/auth/login').send({
        email: 'admin@anushreer.dev',
        password: 'CorrectPassword123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.admin.email).toBe('admin@anushreer.dev');
    });

    it('should reject login on invalid password with 401', async () => {
      const res = await request(app).post('/api/admin/auth/login').send({
        email: 'admin@anushreer.dev',
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.token).toBeUndefined();
    });
  });

  describe('Protected Message Management', () => {
    it('should reject unauthenticated access with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/admin/messages');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Authentication token is required');
    });

    it('should allow authenticated admin to retrieve messages with pagination', async () => {
      const res = await request(app)
        .get('/api/admin/messages?page=1&limit=10')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.total).toBe(1);
    });

    it('should allow authenticated admin to update message status', async () => {
      const res = await request(app)
        .patch('/api/admin/messages/msg_1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'READ', adminNotes: 'Reviewed candidate inquiry' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('READ');
      expect(mockPrisma.contactMessage.update).toHaveBeenCalled();
    });

    it('should allow authenticated admin to delete a message', async () => {
      const res = await request(app)
        .delete('/api/admin/messages/msg_1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.contactMessage.delete).toHaveBeenCalledWith({
        where: { id: 'msg_1' },
        select: { id: true },
      });
    });
  });
});

