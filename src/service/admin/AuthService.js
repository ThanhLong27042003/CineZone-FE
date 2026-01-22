import { authHttp, http } from "../../../utils/baseUrl";

export const adminLogin = (formData) => {
  return http
    .post("/auth/log-in", formData, { withCredentials: true })
    .then((res) => res.data.result.token);
};

export const adminLogout = (formData) => {
  return authHttp
    .post("/auth/log-out", formData, { withCredentials: true })
    .then((res) => {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("myInfo");
      return res.data.result;
    });
};

export const getAdminInfo = () => {
  return authHttp.get("/auth/me").then((res) => res.data.result);
};
