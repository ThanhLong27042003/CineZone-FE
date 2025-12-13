import { http } from "../../../utils/baseUrl";

export const getAllRole = () => {
  return http.get("/role/getAllRole").then((res) => res.data.result);
};

export const createRole = (formData) => {
  return http.post("/role/createRole", formData).then((res) => res.data.result);
};

export const updateRole = (formData) => {
  return http.put("/role/updateRole", formData).then((res) => res.data.result);
};

export const deleteRole = (roleName) => {
  return http
    .delete(`/role/deleteRole/${roleName}`)
    .then((res) => res.data.result);
};
