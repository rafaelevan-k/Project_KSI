import axios from "axios";

const api = axios.create({
  baseURL: `http://${window.location.hostname}:8000/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 419)) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?expired=1";
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: any) => {
  const response = await api.post("/login", credentials);
  if (response.data.access_token) {
    localStorage.setItem("auth_token", response.data.access_token);
  }
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data: any) => {
  const response = await api.post("/reset-password", data);
  return response.data;
};

export const changePassword = async (data: any) => {
  const response = await api.post("/change-password", data);
  return response.data;
};

export const verifyEmail = async (url: string) => {
  const response = await axios.get(url, {
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
};

export const logout = async () => {
  await api.post("/logout");
  localStorage.removeItem("auth_token");
};

export const getSecurityLevel = async () => {
  const response = await api.get("/security-level");
  return response.data;
};

export const setSecurityLevel = async (level: "low" | "normal") => {
  const response = await api.post("/security-level", { security_level: level });
  return response.data;
};

export const testSqlInjection = async (id: string) => {
  const response = await api.get("/vulnerable/sql-injection", { params: { id } });
  return response.data;
};

export const testXss = async (name: string) => {
  const response = await api.get("/vulnerable/xss", { params: { name } });
  return response.data;
};

export default api;
