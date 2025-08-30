export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function verifyToken() {
  const res = await fetch(`${BASE_URL}/api/auth/verify-token`, { headers: { ...authHeaders() } });
  if (!res.ok) {
    logout(); // Token is invalid, so log out
    throw new Error(await res.text());
  }
  return res.json();
}

export async function fetchCertificates() {
  const res = await fetch(`${BASE_URL}/api/certificates`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchPublicCertificates(userId) {
  const res = await fetch(`${BASE_URL}/api/certificates/user/${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchPublicProfile(userId) {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/public`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createCertificate(payload) {
  const res = await fetch(`${BASE_URL}/api/certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCertificate(id) {
  const res = await fetch(`${BASE_URL}/api/certificates/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadFileToBackend(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/api/upload`, { method: 'POST', headers: { ...authHeaders() }, body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { url }
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

export async function register(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

export async function fetchUserProfile() {
  const res = await fetch(`${BASE_URL}/api/users/me`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateUserProfile(payload) {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function logout() {
  localStorage.removeItem('token');
}
