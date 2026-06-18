import { api } from "../services/api";

export const moduleGeneratorApi = {
  async generate(payload: Record<string, unknown>) {
    return (await api.post("module-generator", payload)).data;
  },
  async getTables(): Promise<string[]> {
    const response = await api.get("module-generator/tables");
    return response.data?.data ?? [];
  },
};
