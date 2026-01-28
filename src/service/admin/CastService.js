import { authHttp } from "../../../utils/baseUrl";

export const getAllCastsForAdmin = () => {
  return authHttp.get("/cast/getAllCast").then((res) => res.data.result);
};

export const createCast = (formData) => {
  return authHttp.post("/cast", formData).then((res) => res.data.result);
};

export const updateCast = (castId, formData) => {
  return authHttp.put(`/cast/${castId}`, formData).then((res) => res.data.result);
};

export const deleteCast = (castId) => {
  return authHttp.delete(`/cast/${castId}`).then((res) => res.data.result);
};
