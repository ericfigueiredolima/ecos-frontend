import axios from 'axios';

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${backendUrl}/api`, // Aponta dinamicamente para o back-end correto
});

export default api;