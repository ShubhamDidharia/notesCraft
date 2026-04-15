const request = async (url, options = {}) => {
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const api = {
  signUp: (payload) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  signIn: (payload) => request('/api/auth/signin', { method: 'POST', body: JSON.stringify(payload) }),
  me: (token) => request('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
  getProfile: (token) => request('/api/users/profile', { headers: { Authorization: `Bearer ${token}` } }),
  getNotes: (token) => request('/api/notes', { headers: { Authorization: `Bearer ${token}` } }),
  searchNotes: (token, q) => {
    const query = `?q=${encodeURIComponent(q)}`;
    return request(`/api/notes/search${query}`, { headers: { Authorization: `Bearer ${token}` } });
  },
  createNote: (token, payload) =>
    request('/api/notes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  updateNote: (token, id, payload) =>
    request(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  deleteNote: (token, id) =>
    request(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};
