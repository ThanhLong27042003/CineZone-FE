import axios from "axios";
import { DOMAIN_BE } from "./constant";

const getAccessToken = () => sessionStorage.getItem("ACCESS_TOKEN");
export const http = axios.create({
  baseURL: DOMAIN_BE,
  timeout: 10000,
  withCredentials: true,
});

export const authHttp = axios.create({
  baseURL: DOMAIN_BE,
  timeout: 10000,
  withCredentials: true,
});

authHttp.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

authHttp.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (err.response && err.response.status === 401) {
      try {
        const accessToken = await http
          .post("/auth/refreshToken", null, {
            withCredentials: true,
          })
          .then((res) => res.data.result.accessToken);
        sessionStorage.setItem("ACCESS_TOKEN", accessToken);
        err.config.headers.Authorization = `Bearer ${accessToken}`;
        return authHttp(err.config);
      } catch (err) {
        sessionStorage.removeItem("ACCESS_TOKEN");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);
