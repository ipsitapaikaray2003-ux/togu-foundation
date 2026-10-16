// TOGU Foundation API Client Service

export const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '') + '/api';

// Helper for fetch requests with credentials and JWT
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('togu_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData (file upload), remove Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // include cookies
  };

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, config);

  // If CSV export, return blob
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    if (!response.ok) throw new Error('Failed to export CSV');
    return await response.blob();
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = { success: false, message: 'Invalid response from server' };
  }

  if (!response.ok) {
    // If unauthorized, clear token
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('togu_admin_token');
      localStorage.removeItem('togu_admin_user');
      window.dispatchEvent(new Event('togu_auth_expired'));
    }
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// 1. Auth Service
export const authApi = {
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  changePassword: (data) => request('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// 2. Dashboard Service
export const dashboardApi = {
  getStats: () => request('/dashboard/stats')
};

// 3. Volunteers Service
export const volunteersApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/volunteers?${qs}`);
  },
  getById: (id) => request(`/volunteers/${id}`),
  create: (data) => request('/volunteers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/volunteers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/volunteers/${id}`, { method: 'DELETE' }),
  exportCsv: async (params = {}) => {
    const qs = new URLSearchParams({ ...params, exportCsv: 'true' }).toString();
    const blob = await request(`/volunteers?${qs}`);
    downloadBlob(blob, 'togu_volunteers.csv');
  },
  submitPublic: (data) => request('/volunteers/public', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// 4. Enquiries Service
export const enquiriesApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/enquiries?${qs}`);
  },
  getById: (id) => request(`/enquiries/${id}`),
  update: (id, data) => request(`/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/enquiries/${id}`, { method: 'DELETE' }),
  exportCsv: async (params = {}) => {
    const qs = new URLSearchParams({ ...params, exportCsv: 'true' }).toString();
    const blob = await request(`/enquiries?${qs}`);
    downloadBlob(blob, 'togu_enquiries.csv');
  },
  submitPublic: (data) => request('/enquiries/public', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// 5. Members Service
export const membersApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/members?${qs}`);
  },
  getById: (id) => request(`/members/${id}`),
  create: (data) => request('/members', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/members/${id}`, { method: 'DELETE' }),
  exportCsv: async (params = {}) => {
    const qs = new URLSearchParams({ ...params, exportCsv: 'true' }).toString();
    const blob = await request(`/members?${qs}`);
    downloadBlob(blob, 'togu_members.csv');
  }
};

// 6. Programs Service
export const programsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/programs?${qs}`);
  },
  getByIdOrSlug: (idOrSlug) => request(`/programs/${idOrSlug}`),
  create: (data) => request('/programs', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/programs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/programs/${id}`, { method: 'DELETE' })
};

// 7. Events Service
export const eventsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/events?${qs}`);
  },
  getById: (id) => request(`/events/${id}`),
  create: (data) => request('/events', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/events/${id}`, { method: 'DELETE' })
};

// 8. Donations Service
export const donationsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/donations?${qs}`);
  },
  getById: (id) => request(`/donations/${id}`),
  create: (data) => request('/donations', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/donations/${id}`, { method: 'DELETE' }),
  exportCsv: async (params = {}) => {
    const qs = new URLSearchParams({ ...params, exportCsv: 'true' }).toString();
    const blob = await request(`/donations?${qs}`);
    downloadBlob(blob, 'togu_donations.csv');
  },
  submitPublic: (data) => request('/donations/public', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// 9. Expenses Service
export const expensesApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/expenses?${qs}`);
  },
  getById: (id) => request(`/expenses/${id}`),
  create: (data) => request('/expenses', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
  exportCsv: async (params = {}) => {
    const qs = new URLSearchParams({ ...params, exportCsv: 'true' }).toString();
    const blob = await request(`/expenses?${qs}`);
    downloadBlob(blob, 'togu_expenses.csv');
  }
};

// 10. Website Content Service
export const contentApi = {
  getAll: () => request('/content'),
  getSection: (key) => request(`/content/${key}`),
  updateSection: (key, data) => request(`/content/${key}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// 11. Gallery Service
export const galleryApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/gallery?${qs}`);
  },
  create: (data) => request('/gallery', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/gallery/${id}`, { method: 'DELETE' })
};

// 12. Team Service
export const teamApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/team?${qs}`);
  },
  create: (data) => request('/team', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => request(`/team/${id}`, { method: 'DELETE' })
};

// 13. Reports Service
export const reportsApi = {
  getSummary: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/reports/summary?${qs}`);
  }
};

// 14. Admin Users Service (Super Admin)
export const adminUsersApi = {
  getAll: () => request('/admin-users'),
  create: (data) => request('/admin-users', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/admin-users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  resetPassword: (id, newPassword) => request(`/admin-users/${id}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify({ newPassword })
  }),
  delete: (id) => request(`/admin-users/${id}`, { method: 'DELETE' })
};

// 15. Activity Logs Service
export const activityLogsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/activity-logs?${qs}`);
  }
};

// 16. Upload Service
export const uploadApi = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', {
      method: 'POST',
      body: formData
    });
  }
};

// Utility to download CSV Blob in browser
function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
