import { BaseApi } from "./baseApi";
import { api } from "../services/api";

class UserApi extends BaseApi {
  async getRoles(userId: string) {
    return (await api.get(`${this.endpoint}/${userId}/roles`, {
      params: { _: Date.now() },
    })).data;
  }

  async saveRoles(userId: string, roleIds: string[]) {
    return (await api.post(`${this.endpoint}/${userId}/roles`, roleIds)).data;
  }
}

export const userApi = new UserApi("UsersApi");
