// Base API configuration
const API_BASE_URL = 'https://backend-production-eab3b.up.railway.app/api';

// Helper function to handle API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw error;
  }
}

// GET request
export function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

// POST request
export function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT request
export function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE request
export function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
};
