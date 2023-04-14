import { PUBLISH_API_URL } from "@/lib/config";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export async function apiRequest<D = {}, R = unknown>({
  url,
  method,
  data,
  headers,
  params,
  responseType,
}: AxiosRequestConfig<D>) {
  return await axios.request<D, AxiosResponse<R>>({
    url: `${PUBLISH_API_URL}/api${url}`,
    method,
    data,
    headers,
    params,
    responseType,
  });
}
