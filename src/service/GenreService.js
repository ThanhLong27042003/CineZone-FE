import { http } from "../../utils/baseUrl";

export const getAllGenre = () => {
  return http.get("/genre/getAllGenre").then((res) => res.data.result);
};

export const getGenreById = (genreId) => {
  return http.get(`/genre/${genreId}`).then((res) => res.data.result);
};
