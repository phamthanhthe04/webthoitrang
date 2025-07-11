import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🌐 [API REQUEST]', config.method?.toUpperCase(), config.url);
    console.log('🌐 [API REQUEST] Headers:', config.headers);
    if (config.data) {
      console.log('🌐 [API REQUEST] Data:', config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ [API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API RESPONSE]', response.status, response.config.url);
    console.log('✅ [API RESPONSE] Data:', response.data);
    return response;
  },
  (error) => {
    console.error(
      '❌ [API RESPONSE ERROR]',
      error.response?.status,
      error.config?.url
    );
    console.error('❌ [API RESPONSE ERROR] Data:', error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
