import { authHttp } from "../../../utils/baseUrl";

export const getAllUsersForAdmin = (page, size) => {
  return authHttp
    .get(`/admin/users/getAllUsers/${page}/${size}`)
    .then((res) => res.data.result);
};

export const getUserById = (userId) => {
  return authHttp.get(`/admin/users/${userId}`).then((res) => res.data.result);
};

export const createUser = (formData) => {
  return authHttp.post("/admin/users", formData).then((res) => res.data.result);
};

export const updateUser = (userId, formData) => {
  return authHttp
    .put(`/admin/users/${userId}`, formData)
    .then((res) => res.data.result);
};

export const lockUser = (userId) => {
  return authHttp.post(`/admin/users/${userId}`).then((res) => res.data.result);
};
