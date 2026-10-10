/**
 * API service for portfolio frontend integration
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export async function sendContactMessage({ name, email, subject, message, _gotcha = '' }) {
  const endpoint = `${API_BASE_URL}/api/contact`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _gotcha,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.details = data?.details || [];
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error('Unable to connect to the server. Please check your connection or email directly.');
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

export async function fetchProjects() {
  const endpoint = `${API_BASE_URL}/api/projects`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Failed to fetch projects (status: ${res.status})`);
    }
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('[API Integration] Project API unavailable, falling back to local dataset:', err.message);
    return null;
  }
}

