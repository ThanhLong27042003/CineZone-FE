import { authHttp, http } from "../../utils/baseUrl";

export const login = (formData) => {
  return http
    .post("/auth/log-in", formData)
    .then((res) => res.data.result.token);
};

export const getMyInfo = () => {
  return authHttp.get("/user/me").then((res) => res.data.result);
};

export const register = (formData) => {
  return http.post("/user/createUser", formData).then((res) => res.data.result);
};
