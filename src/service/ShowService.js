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
