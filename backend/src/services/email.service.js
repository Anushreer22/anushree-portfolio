import getResendClient from '../config/resend.js';
import env from '../config/env.js';

export async function sendContactNotification({ name, email, subject, message, id, createdAt }) {
  try {
    const resend = getResendClient();

    const emailSubject = `Portfolio Contact: ${subject}`;
    const formattedDate = new Date(createdAt || Date.now()).toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    });

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0e0d15; color: #f3f0f8; border: 1px solid #332d48; border-radius: 8px;">
        <h2 style="color: #c4b5fd; margin-top: 0; border-bottom: 1px solid #2a253c; padding-bottom: 12px;">New Contact Message Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #a6a2b2; width: 100px;"><strong>From:</strong></td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a6a2b2;"><strong>Subject:</strong></td>
            <td style="padding: 8px 0; color: #ffffff;">${escapeHtml(subject)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a6a2b2;"><strong>Received:</strong></td>
            <td style="padding: 8px 0; color: #b5a8d2;">${formattedDate} (IST)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a6a2b2;"><strong>Message ID:</strong></td>
            <td style="padding: 8px 0; color: #8e899b; font-family: monospace;">${id}</td>
          </tr>
        </table>
        <div style="background: #171523; padding: 18px; border-radius: 6px; border: 1px solid #2a253d; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #dedbe6;">${escapeHtml(message)}</div>
        <p style="margin-top: 24px; font-size: 11px; color: #777182;">This is an automated notification from your portfolio contact API.</p>
      </div>
    `;

    const result = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: emailSubject,
      html: htmlContent,
    });

    if (result.error) {
      console.warn('⚠️ [Resend Service Warning]:', result.error.message || result.error);
      return { success: false, error: result.error.message || 'Resend error' };
    }

    return { success: true, messageId: result.data?.id };
  } catch (error) {
    // Avoid losing saved message if email delivery fails
    console.warn('⚠️ [Email Delivery Failure]: Failed to deliver email notification, message remains safely persisted.');
    return { success: false, error: error.message };
  }
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

