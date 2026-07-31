import axios from 'axios';

// Change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000/api/v1';

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

export async function submitSkinQuiz({ skinType, concerns, allergens }) {
  const { data } = await client.post('/auth/skin-quiz', { skinType, concerns, allergens });
  return data;
}

export default client;
