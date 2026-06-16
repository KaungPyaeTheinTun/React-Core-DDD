import { api } from "../services/api";

export const authApi = {
  login: async (payload) => {
    return await api.post("/auth/login", payload);
  },

  register: async (payload) => {
    return await api.post("/auth/register", payload);
  },

  logout: async (refreshToken) => {
    return await api.post("/auth/logout", refreshToken, {
      headers: { "Content-Type": "application/json" },
    });
  },
};
