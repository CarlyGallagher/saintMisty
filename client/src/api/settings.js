import axios from "axios";
import API_URL from "../config/api";

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

export async function fetchSettings() {
  const { data } = await api.get("/api/settings");
  return data;
}

export async function updateSettings(payload) {
  const { data } = await api.put("/api/settings", payload);
  return data;
}
