import { http } from "../../utils/baseUrl";

export const getAllShow = () => {
  return http.get("/show/getAllShow").then((res) => res.data.result);
};

export const getShowById = (showId) => {
  return http.get(`/show/${showId}`).then((res) => res.data.result);
};

export const getAllShowByMovieId = (movieId) => {
  return http.get(`/show/getAllShow/${movieId}`).then((res) => res.data.result);
};

export const getShowsByDate = (date) => {
  return http.get(`/show/by-date?date=${date}`).then((res) => res.data.result);
};

// ✨ NEW: Lấy danh sách ngày có suất chiếu
export const getAvailableDates = (movieId = null) => {
  const params = movieId ? `?movieId=${movieId}` : "";
  return http
    .get(`/show/available-dates${params}`)
    .then((res) => res.data.result);
};
