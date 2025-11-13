import { http } from "../../utils/baseUrl";

export const search = (keyword) => {
  return http.get(`/general/search/${keyword}`).then((res) => res.data.result);
};
