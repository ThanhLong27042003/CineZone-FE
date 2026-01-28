import { authHttp } from "../../../utils/baseUrl";

export const getAllRooms = () => {
  return authHttp.get("/admin/rooms").then((res) => res.data.result);
};

export const createRoom = (formData) => {
  return authHttp.post("/admin/rooms", formData).then((res) => res.data.result);
};

export const updateRoom = (roomId, formData) => {
  return authHttp
    .put(`/admin/rooms/${roomId}`, formData)
    .then((res) => res.data.result);
};

export const deleteRoom = (roomId) => {
  return authHttp
    .delete(`/admin/rooms/${roomId}`)
    .then((res) => res.data.result);
};
