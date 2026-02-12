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

export async function fetchPresave() {
  const { data } = await api.get("/api/presave");
  return data;
}

export async function updatePresave(payload) {
  const { data } = await api.put("/api/presave", payload);
  return data;
}

export async function deletePresave() {
  const { data } = await api.delete("/api/presave");
  return data;
}
