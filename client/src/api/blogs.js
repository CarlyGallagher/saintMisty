import axios from "axios";
import API_URL from "../config/api";

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchBlogs() {
  const { data } = await api.get("/api/blogs");
  return data;
}

export async function fetchBlog(id) {
  const { data } = await api.get(`/api/blogs/${id}`);
  return data;
}

export async function createBlog(payload) {
  const { data } = await api.post("/api/blogs", payload);
  return data;
}

export async function updateBlog(id, payload) {
  const { data } = await api.put(`/api/blogs/${id}`, payload);
  return data;
}

export async function deleteBlog(id) {
  await api.delete(`/api/blogs/${id}`);
}
