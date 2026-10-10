import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_BASE_URL = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl}/api/v1`;

const client = axios.create({ baseURL: API_BASE_URL });

// Automatically attach the JWT (if we have one) to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auraglow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function registerUser({ name, email, password }) {
  const { data } = await client.post('/auth/register', { name, email, password });
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await client.post('/auth/login', { email, password });
  return data;
}

export async function fetchMyProfile() {
  const { data } = await client.get('/auth/me');
  return data;
}

export async function submitSkinQuiz(quizData) {
  const { data } = await client.post('/auth/skin-quiz', quizData);
  return data;
}

export default client;
