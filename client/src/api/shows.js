import axios from "axios";

// Create axios instance with auth interceptor
const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchShows() {
  const { data } = await api.get("/api/shows");
  return data;
}

export async function fetchShow(id) {
  const { data } = await api.get(`/api/shows/${id}`);
  return data;
}

export async function createShow(payload) {
  const { data } = await api.post("/api/shows", payload);
  return data;
}

export async function updateShow(id, payload) {
  const { data } = await api.put(`/api/shows/${id}`, payload);
  return data;
}

export async function deleteShow(id) {
  await api.delete(`/api/shows/${id}`);
}
