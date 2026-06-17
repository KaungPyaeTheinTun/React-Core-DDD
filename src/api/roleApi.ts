import { api } from "../services/api";
import { BaseApi } from "./baseApi";

class RoleApi extends BaseApi {
  async getPermissions(roleId: string) {
    return (await api.get(`${this.endpoint}/${roleId}/permissions`)).data;
  }

  async savePermissions(roleId: string, permissionIds: string[]) {
    return (await api.post(`${this.endpoint}/${roleId}/permissions`, permissionIds)).data;
  }
}

export const roleApi = new RoleApi("roles");
