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

export async function fetchSubscribers() {
  const { data } = await api.get("/api/newsletter/subscribers");
  return data;
}

export async function subscribe(payload) {
  const { data } = await api.post("/api/newsletter/subscribe", payload);
  return data;
}

export async function sendNewsletter(payload) {
  const { data } = await api.post("/api/newsletter/send", payload);
  return data;
}

export async function deleteSubscriber(id) {
  await api.delete(`/api/newsletter/subscribers/${id}`);
}
