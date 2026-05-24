import axios from "axios";
import { env } from "@/config/env";

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiBaseUrl() {
  return httpClient.defaults.baseURL;
}
