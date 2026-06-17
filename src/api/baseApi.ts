import { api } from "../services/api";
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}
interface PaginatedData<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}
interface MediaItem {
  id: string;
  url: string;
  originalName?: string;
}
export class BaseApi {
  readonly endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  async list<T = Record<string, unknown>>(
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedData<T>>> {
    return (await api.get(`${this.endpoint}?page=${page}&pageSize=${pageSize}`))
      .data;
  }
  async get<T = Record<string, unknown>>(
    id: string
  ): Promise<ApiResponse<T>> {
    return (await api.get(`${this.endpoint}/${id}`)).data;
  }
  async create<T = Record<string, unknown>>(
    payload: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return (await api.post(this.endpoint, payload)).data;
  }
  async update<T = Record<string, unknown>>(
    id: string,
    payload: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return (await api.put(`${this.endpoint}/${id}`, payload)).data;
  }
  async remove(id: string): Promise<ApiResponse<null>> {
    return (await api.delete(`${this.endpoint}/${id}`)).data;
  }
  async getMedia(
    id: string
  ): Promise<ApiResponse<MediaItem[]>> {
    return (await api.get(`${this.endpoint}/${id}/media`)).data;
  }
  async uploadMedia(
    id: string,
    files: File[]
  ): Promise<ApiResponse<null>> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return (await api.post(`${this.endpoint}/${id}/media`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  }
  async deleteMedia(
    id: string,
    mediaId: string
  ): Promise<ApiResponse<null>> {
    return (await api.delete(`${this.endpoint}/${id}/media/${mediaId}`)).data;
  }
}
