import { api } from "../services/api";

export const moduleGeneratorApi = {
  async generate(payload: Record<string, unknown>) {
    return (await api.post("module-generator", payload)).data;
  },
};
