import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5080/api/",
  headers: { "Content-Type": "application/json" },
});

//REQUEST INTERCEPTOR: Automatically attaches the JWT bearer token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//RESPONSE INTERCEPTOR: Handle global authorization failures (e.g., token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear compromised cache and kick back to login if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: async (payload) => (await api.post("auth/login", payload)).data,
  register: async (payload) => (await api.post("auth/register", payload)).data,
};

export const userApi = {
  list: async () => (await api.get("users")).data,
  create: async (payload) => (await api.post("users", payload)).data,
  update: async (id, payload) => (await api.put(`users/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`users/${id}`)).data,
};

export const productApi = {
  list: async () => (await api.get("products")).data,
  create: async (payload) => (await api.post("products", payload)).data,
  update: async (id, payload) =>
    (await api.put(`products/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`products/${id}`)).data,
};
