import { http } from "../../../utils/baseUrl";

export const getAllRooms = () => {
  return http.get("/admin/rooms").then((res) => res.data.result);
};
