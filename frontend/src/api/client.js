const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export function getToken() {
  return localStorage.getItem('civicmind_token');
}

export function setSession(token, user) {
  localStorage.setItem('civicmind_token', token);
  localStorage.setItem('civicmind_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('civicmind_token');
  localStorage.removeItem('civicmind_user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('civicmind_user');
  return raw ? JSON.parse(raw) : null;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail ?? 'Request failed');
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/users/me'),
  listIssues: (params = {}) => {
    const query = new URLSearchParams(params);
    return request(`/issues${query.size ? `?${query}` : ''}`);
  },
  createIssue: (formData) => request('/issues', { method: 'POST', body: formData }),
  updateIssue: (id, payload) => request(`/issues/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  analyticsSummary: () => request('/analytics/summary'),
  categoryCounts: () => request('/analytics/categories'),
};

