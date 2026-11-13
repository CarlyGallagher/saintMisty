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

// Undo a delete: puts the subscribers back as they were
export async function restoreSubscribers(subscribers) {
  const { data } = await api.post("/api/newsletter/subscribers/restore", { subscribers });
  return data;
}

export async function previewNewsletter(payload) {
  const { data } = await api.post("/api/newsletter/preview", payload);
  return data.html;
}

export async function uploadNewsletterImage(file) {
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post("/api/newsletter/images", form);
  return data.url;
}

// Public: subscriber email settings, reached from the links in each newsletter
const prefsPath = (id, token) => `/api/newsletter/preferences/${encodeURIComponent(id)}/${encodeURIComponent(token)}`;

export async function fetchEmailPreferences(id, token) {
  const { data } = await api.get(prefsPath(id, token));
  return data;
}

export async function updateEmailPreferences(id, token, interests) {
  const { data } = await api.put(prefsPath(id, token), { interests });
  return data;
}

export async function unsubscribeWithToken(id, token) {
  await api.post(`/api/newsletter/unsubscribe/${encodeURIComponent(id)}/${encodeURIComponent(token)}`);
}
