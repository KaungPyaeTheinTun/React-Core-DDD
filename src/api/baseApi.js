import { api } from "../services/api";

export class BaseApi {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async list(page = 1, pageSize = 10) {
    return (await api.get(`${this.endpoint}?page=${page}&pageSize=${pageSize}`))
      .data;
  }

  async get(id) {
    return (await api.get(`${this.endpoint}/${id}`)).data;
  }

  async create(payload) {
    return (await api.post(this.endpoint, payload)).data;
  }

  async update(id, payload) {
    return (await api.put(`${this.endpoint}/${id}`, payload)).data;
  }

  async remove(id) {
    return (await api.delete(`${this.endpoint}/${id}`)).data;
  }

  async getMedia(id) {
    return (await api.get(`${this.endpoint}/${id}/media`)).data;
  }

  async uploadMedia(id, files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return (await api.post(`${this.endpoint}/${id}/media`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  }

  async deleteMedia(id, mediaId) {
    return (await api.delete(`${this.endpoint}/${id}/media/${mediaId}`)).data;
  }
}
