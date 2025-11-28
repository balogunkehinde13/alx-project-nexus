import axios from "axios";

// Automatically choose the correct API base URL:
// - Production → uses NEXT_PUBLIC_API_URL (your Vercel domain)
// - Localhost → falls back to http://localhost:3000/api
//
// NOTE: We ensure `/api` is always included.

const baseURL =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

// Attach auth token if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
