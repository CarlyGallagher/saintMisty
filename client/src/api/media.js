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

export async function fetchMedia() {
  const { data } = await api.get("/api/media");
  return data;
}

export async function fetchMediaItem(id) {
  const { data } = await api.get(`/api/media/${id}`);
  return data;
}

export async function createMedia(payload) {
  const { data } = await api.post("/api/media", payload);
  return data;
}

export async function updateMedia(id, payload) {
  const { data } = await api.put(`/api/media/${id}`, payload);
  return data;
}

export async function deleteMedia(id) {
  await api.delete(`/api/media/${id}`);
}

export async function uploadMediaFile(formData) {
  const { data } = await api.post("/api/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
