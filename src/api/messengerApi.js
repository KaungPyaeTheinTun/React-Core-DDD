import { api } from "../services/api";
import { BaseApi } from "./baseApi";

class MessengerApi extends BaseApi {
  async getOptions() {
    return (await api.get(`${this.endpoint}/options`)).data;
  }
}

export const messengerApi = new MessengerApi("MessengerApi");
