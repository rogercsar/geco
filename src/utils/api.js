import axios from 'axios';

// Base URL configurable via environment variable for production (Netlify) and development
// Example: VITE_API_BASE_URL=https://your-backend.example.com
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;