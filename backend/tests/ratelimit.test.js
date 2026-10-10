import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';

describe('Rate Limiting Protections', () => {
  let testApp;

  beforeEach(() => {
    testApp = express();
    testApp.use(express.json());

    const testLimiter = rateLimit({
      windowMs: 1000,
      max: 2, // allow only 2 requests
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: 'Too many requests. Please try again later.',
      },
    });

    testApp.post('/api/contact-test', testLimiter, (req, res) => {
      res.status(200).json({ success: true });
    });
  });

  it('should allow requests under the limit and block subsequent requests exceeding the limit with 429', async () => {
    // Request 1: OK
    const res1 = await request(testApp).post('/api/contact-test').send({});
    expect(res1.status).toBe(200);

    // Request 2: OK
    const res2 = await request(testApp).post('/api/contact-test').send({});
    expect(res2.status).toBe(200);

    // Request 3: Blocked by Rate Limiter
    const res3 = await request(testApp).post('/api/contact-test').send({});
    expect(res3.status).toBe(429);
    expect(res3.body.success).toBe(false);
    expect(res3.body.error).toContain('Too many requests');
  });
});

