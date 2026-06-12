import { api } from "../services/api";
import { BaseApi } from "./baseApi";

class PermissionApi extends BaseApi {
  async getAll() {
    const res1 = await api.get(`${this.endpoint}?page=1&pageSize=10`);
    const { items, totalCount } = res1.data.data;

    if (totalCount <= 10) return res1.data;

    const pagesLeft = Math.ceil(totalCount / 10) - 1;
    const rest = await Promise.all(
      Array.from({ length: pagesLeft }, (_, i) =>
        api.get(`${this.endpoint}?page=${i + 2}&pageSize=10`),
      ),
    );

    const allItems = rest.reduce(
      (acc, r) => acc.concat(r.data.data.items),
      items,
    );
    return { data: { items: allItems, totalCount } };
  }
}

export const permissionApi = new PermissionApi("PermissionsApi");
