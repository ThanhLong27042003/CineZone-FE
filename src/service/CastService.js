import { http } from "../../utils/baseUrl";

export const getAllCast = () => {
  return http.get("/cast/getAllCast").then((res) => res.data.result);
};

export const getCastById = (castId) => {
  return http.get(`/cast/${castId}`).then((res) => res.data.result);
};
