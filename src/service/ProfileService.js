import { authHttp } from "../../utils/baseUrl";

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
export const getMyInfo = () => {
  return authHttp.get("/auth/me").then((res) => res.data.result);
};

export const addFavoriteMovie = (userId, movieId) => {
  return authHttp
    .put(`/user/addFavoriteMovie/${userId}/${movieId}`)
    .then((res) => res.data.result);
};

export const removeFavoriteMovie = (userId, movieId) => {
  return authHttp
    .delete(`/user/removeFavoriteMovie/${userId}/${movieId}`)
    .then((res) => res.data.result);
};
