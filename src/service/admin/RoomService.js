import { authHttp } from "../../../utils/baseUrl";

export const getAllRooms = () => {
  return authHttp.get("/admin/rooms").then((res) => res.data.result);
};
