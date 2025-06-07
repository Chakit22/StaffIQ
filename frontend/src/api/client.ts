// frontend/src/api/client.ts
import axios from "axios";

// Simple API client with minimal config
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;
