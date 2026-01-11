import { authHttp, http } from "../../utils/baseUrl";

export const login = (formData) => {
  return http
    .post("/auth/log-in", formData)
    .then((res) => res.data.result.token);
};

export const logOut = (formData) => {
  localStorage.removeItem("ACCESS_TOKEN");
  return authHttp
    .post("/auth/log-out", formData)
    .then((res) => res.data.result);
};

export const register = (formData) => {
  return http.post("/user/createUser", formData).then((res) => res.data.result);
};
