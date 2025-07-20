import axios from "axios";
import { BaseConfig } from "../../config/baseConfig";


export const apiClient = axios.create({
  baseURL: BaseConfig.BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});