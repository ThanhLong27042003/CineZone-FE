import { http } from "../../../utils/baseUrl";

export const getAllUsersForAdmin = (page, size) => {
  return http
    .get(`/admin/users/getAllUsers/${page}/${size}`)
    .then((res) => res.data.result);
};

export const getUserById = (userId) => {
  return http.get(`/admin/users/${userId}`).then((res) => res.data.result);
};

export const createUser = (formData) => {
  return http.post("/admin/users", formData).then((res) => res.data.result);
};

export const updateUser = (userId, formData) => {
  return http
    .put(`/admin/users/${userId}`, formData)
    .then((res) => res.data.result);
};

export const lockUser = (userId) => {
  return http.post(`/admin/users/${userId}`).then((res) => res.data.result);
};
