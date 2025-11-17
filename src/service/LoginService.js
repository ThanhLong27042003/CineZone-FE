import { authHttp, http } from "../../utils/baseUrl";

export const login = (formData) => {
  return http
    .post("/auth/log-in", formData)
    .then((res) => res.data.result.token);
};

export const logOut = (formData) => {
  return authHttp
    .post("/auth/log-out", formData)
    .then((res) => res.data.result);
};

export const getMyInfo = () => {
  return authHttp.get("/auth/me").then((res) => res.data.result);
};

export const register = (formData) => {
  return http.post("/user/createUser", formData).then((res) => res.data.result);
};

export const updateMyInfo = (formData) => {
  return authHttp
    .post("/auth/update/me", formData)
    .then((res) => res.data.result);
};

export const changePassWord = (formData) => {
  return authHttp
    .post(`/auth/changePassWord/me`, formData)
    .then((res) => res.data.result);
};
