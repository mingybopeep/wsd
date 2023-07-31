import axios, { AxiosRequestConfig } from "axios";
import { config } from "./configVars";

const AxiosInstance = axios.create({
  baseURL: config.apiUrl,
});

AxiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  // Do something before request is sent
  let token = localStorage.getItem("token");
  if (token) {
    // @ts-ignore
    config.headers["Authorization"] = token;
  }
  return config;
});

export default AxiosInstance;
