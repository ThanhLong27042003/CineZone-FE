import { authHttp } from "../../../utils/baseUrl";

export const getAllRole = () => {
  return authHttp.get("/role/getAllRole").then((res) => res.data.result);
};

export const createRole = (formData) => {
  return authHttp.post("/role/createRole", formData).then((res) => res.data.result);
};

export const updateRole = (formData) => {
  return authHttp.put("/role/updateRole", formData).then((res) => res.data.result);
};

export const deleteRole = (roleName) => {
  return authHttp
    .delete(`/role/deleteRole/${roleName}`)
    .then((res) => res.data.result);
};
