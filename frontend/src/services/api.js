import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
};

// Articles API
export const articlesAPI = {
  getAll: (params = '') => api.get(`/articles${params}`),
  getById: (id) => api.get(`/articles/${id}`),
  getByCategory: (categoryId) => api.get(`/articles?category_id=${categoryId}`),
  getByTag: (tagName) => api.get(`/articles?tag=${tagName}`),
  search: (query) => api.get(`/articles?search=${query}`),
  create: (articleData) => api.post('/articles', articleData),
  update: (id, articleData) => api.put(`/articles/${id}`, articleData),
  delete: (id) => api.delete(`/articles/${id}`),
  // Homepage optimized endpoint
  getHomepage: (signal) => api.get('/homepage', { signal })
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Tags API
export const tagsAPI = {
  getAll: () => api.get('/tags'),
  getById: (id) => api.get(`/tags/${id}`),
  create: (tagData) => api.post('/tags', tagData),
  update: (id, tagData) => api.put(`/tags/${id}`, tagData),
  delete: (id) => api.delete(`/tags/${id}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getArticles: (page = 1, perPage = 10) => api.get(`/admin/articles?page=${page}&per_page=${perPage}`),
  createArticle: (articleData) => api.post('/admin/articles', articleData),
  updateArticle: (id, articleData) => api.put(`/admin/articles/${id}`, articleData),
  deleteArticle: (id) => api.delete(`/admin/articles/${id}`),
  getUsers: (page = 1, perPage = 10) => api.get(`/admin/users?page=${page}&per_page=${perPage}`),
};

// Auth helpers
export const authHelpers = {
  setToken: (token) => {
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  isAdmin: () => {
    const user = authHelpers.getUser();
    return user && user.role === 'admin';
  }
};

// Authors API
export const authorsAPI = {
  getAll: () => api.get('/authors'),
  getById: (id) => api.get(`/authors/${id}`),
  create: (authorData) => api.post('/authors', authorData),
  update: (id, authorData) => api.put(`/authors/${id}`, authorData),
  delete: (id) => api.delete(`/authors/${id}`),
};

// Comments API
export const commentsAPI = {
  getByArticle: (articleId) => api.get(`/articles/${articleId}/comments`),
  create: (commentData) => api.post('/comments', commentData),
  update: (id, commentData) => api.put(`/comments/${id}`, commentData),
  delete: (id) => api.delete(`/comments/${id}`),
};

export default api; 