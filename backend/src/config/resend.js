import { Resend } from 'resend';
import env from './env.js';

let resendInstance = null;

export function getResendClient() {
  if (resendInstance) {
    return resendInstance;
  }

  if (env.RESEND_API_KEY && !env.RESEND_API_KEY.includes('placeholder')) {
    resendInstance = new Resend(env.RESEND_API_KEY);
  } else {
    // Development / fallback mock client
    resendInstance = {
      emails: {
        send: async ({ from, to, subject }) => {
          console.log(`[RESEND MOCK] Email simulation: From <${from}> To <${to}> Subject: "${subject}"`);
          return { data: { id: `mock_${Date.now()}` }, error: null };
        },
      },
    };
  }

  return resendInstance;
}

export function setResendClient(mockClient) {
  resendInstance = mockClient;
}

export default getResendClient;

