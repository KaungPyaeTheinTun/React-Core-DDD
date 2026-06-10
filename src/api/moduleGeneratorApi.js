import { api } from "../services/api";

export const moduleGeneratorApi = {
  async generate(payload) {
    return (await api.post("module-generator", payload)).data;
  },
};
