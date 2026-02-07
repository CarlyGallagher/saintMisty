import axios from "axios";
import API_URL from "../config/api";

const api = axios.create({
  baseURL: API_URL
});

export async function fetchShows() {
  const { data } = await api.get("/api/shows");
  return data;
}
