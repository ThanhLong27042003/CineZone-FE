import { http } from "../../utils/baseUrl";

export const getAllSeat = async () => {
  return http.get("/seat/getAllSeat").then((res) => res.data.result);
};

export const getSeatsByVip = async (vip) => {
  return http.get(`/seat/getSeatsByVip/${vip}`).then((res) => res.data.result);
};

export const getOccupiedSeat = async (showId) => {
  return http.get(`/seat/occupied/${showId}`).then((res) => res.data.result);
};
export const releaseSeat = async (data) => {
  return http.post(`/seat/release`, data).then((res) => res.data.result);
};

export const holdSeat = async (data) => {
  return http.post(`/seat/hold`, data).then((res) => res.data.result);
};
