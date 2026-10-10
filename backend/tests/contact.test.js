import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import * as prismaConfig from '../src/config/prisma.js';
import * as resendConfig from '../src/config/resend.js';

describe('POST /api/contact', () => {
  let mockPrisma;
  let mockResend;

  beforeEach(() => {
    mockPrisma = {
      contactMessage: {
        create: vi.fn().mockResolvedValue({
          id: 'cm_123',
          name: 'Jane Doe',
          email: 'jane@example.com',
          subject: 'Collaboration Opportunity',
          message: 'Hello Anushree, I would love to collaborate on a full stack project with you!',
          status: 'UNREAD',
          emailSent: false,
          createdAt: new Date('2026-10-10T12:00:00Z'),
        }),
        update: vi.fn().mockResolvedValue({}),
      },
    };

    mockResend = {
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: 'email_msg_123' }, error: null }),
      },
    };

    prismaConfig.setPrismaClient(mockPrisma);
    resendConfig.setResendClient(mockResend);
  });

  it('should accept valid contact submission, store in database, and dispatch email', async () => {
    const payload = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Collaboration Opportunity',
      message: 'Hello Anushree, I would love to collaborate on a full stack project with you!',
    };

    const res = await request(app).post('/api/contact').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('cm_123');
    expect(mockPrisma.contactMessage.create).toHaveBeenCalledTimes(1);
    expect(mockResend.emails.send).toHaveBeenCalledTimes(1);
  });

  it('should intercept honeypot spam silently without writing to DB or sending email', async () => {
    const spamPayload = {
      name: 'Bot Spammer',
      email: 'spammer@bot.org',
      subject: 'Buy Cheap Watches',
      message: 'Visit our spam website right now for free tokens!',
      _gotcha: 'http://spam-link.com',
    };

    const res = await request(app).post('/api/contact').send(spamPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.contactMessage.create).not.toHaveBeenCalled();
    expect(mockResend.emails.send).not.toHaveBeenCalled();
  });

  it('should reject invalid email with 400 Bad Request', async () => {
    const invalidPayload = {
      name: 'Jane Doe',
      email: 'not-an-email',
      subject: 'Test Subject',
      message: 'This is a valid length message body for testing.',
    };

    const res = await request(app).post('/api/contact').send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
      ])
    );
  });

  it('should reject missing fields and short messages with 400 Bad Request', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'A',
      email: 'valid@example.com',
      subject: '',
      message: 'Hi', // too short (< 10 chars)
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it('should not lose saved database message if Resend email delivery fails', async () => {
    mockResend.emails.send = vi.fn().mockRejectedValue(new Error('Resend API Down'));

    const payload = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Important Inquiry',
      message: 'This message should still be saved even if email fails.',
    };

    const res = await request(app).post('/api/contact').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.contactMessage.create).toHaveBeenCalledTimes(1);
    // Message is saved and error is tracked on record
    expect(mockPrisma.contactMessage.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'cm_123' },
        data: expect.objectContaining({ emailError: expect.stringContaining('Resend API Down') }),
      })
    );
  });
});

