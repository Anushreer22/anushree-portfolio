import prisma from '../config/prisma.js';
import { sendContactNotification } from './email.service.js';

export async function processContactSubmission({ name, email, subject, message, _gotcha, honeypot, ipAddress, userAgent }) {
  // Bot Honeypot detection
  const isHoneypotTriggered = Boolean((_gotcha && _gotcha.trim().length > 0) || (honeypot && honeypot.trim().length > 0));
  if (isHoneypotTriggered) {
    // Silently succeed to trick bots, but do not persist or send email
    return {
      isBot: true,
      data: {
        id: 'bot_filtered',
        createdAt: new Date().toISOString(),
      },
    };
  }

  // 1. Store valid message in database
  const contactRecord = await prisma.contactMessage.create({
    data: {
      name,
      email,
      subject,
      message,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      status: 'UNREAD',
    },
  });

  // 2. Dispatch email notification asynchronously without risking loss of database record
  let emailDeliveryResult;
  try {
    emailDeliveryResult = await sendContactNotification({
      id: contactRecord.id,
      name,
      email,
      subject,
      message,
      createdAt: contactRecord.createdAt,
    });

    if (emailDeliveryResult && emailDeliveryResult.success) {
      await prisma.contactMessage.update({
        where: { id: contactRecord.id },
        data: { emailSent: true },
      });
    } else if (emailDeliveryResult && emailDeliveryResult.error) {
      await prisma.contactMessage.update({
        where: { id: contactRecord.id },
        data: { emailError: String(emailDeliveryResult.error).slice(0, 255) },
      });
    }
  } catch (emailErr) {
    console.warn('⚠️ [Contact Service]: Background email trigger encountered an issue:', emailErr.message);
  }

  return {
    isBot: false,
    data: {
      id: contactRecord.id,
      createdAt: contactRecord.createdAt,
    },
  };
}

