import { processContactSubmission } from '../services/contact.service.js';

export async function submitContactForm(req, res, next) {
  try {
    const { name, email, subject, message, _gotcha, honeypot } = req.body;
    
    // Extract IP and User-Agent safely
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || null;

    const result = await processContactSubmission({
      name,
      email,
      subject,
      message,
      _gotcha,
      honeypot,
      ipAddress,
      userAgent,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received.',
      data: {
        id: result.data.id,
        createdAt: result.data.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

