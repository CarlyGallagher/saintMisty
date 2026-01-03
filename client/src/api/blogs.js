import axios from "axios";

export async function fetchBlogs() {
  const { data } = await axios.get("/api/blogs");
  return data;
}

export async function fetchBlog(id) {
  const { data } = await axios.get(`/api/blogs/${id}`);
  return data;
}

export async function createBlog(payload) {
  const { data } = await axios.post("/api/blogs", payload);
  return data;
}

export async function updateBlog(id, payload) {
  const { data } = await axios.put(`/api/blogs/${id}`, payload);
  return data;
}

export async function deleteBlog(id) {
  await axios.delete(`/api/blogs/${id}`);
}
