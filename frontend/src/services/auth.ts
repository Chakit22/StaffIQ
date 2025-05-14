import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    return { success: false, message: "Login failed" };
  }
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await api.post("/register", data);
    return response.data;
  } catch (err: any) {
    console.error("Register error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Registration failed",
    };
  }
};
