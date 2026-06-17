import { api } from "../services/api";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  fullName: string;
  password: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    return await api.post("/auth/login", payload);
  },

  register: async (payload: RegisterPayload) => {
    return await api.post("/auth/register", payload);
  },

  logout: async (refreshToken: string) => {
    return await api.post("/auth/logout", refreshToken, {
      headers: { "Content-Type": "application/json" },
    });
  },
};
