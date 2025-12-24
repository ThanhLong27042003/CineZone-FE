import { http } from "../../../utils/baseUrl";

export const getAllMoviesForAdmin = (page, size, search) => {
  return http
    .get(`/admin/movies/getAllMovies/${page}/${size}`, {
      params: { search },
    })
    .then((res) => res.data.result);
};

export const createMovie = (formData) => {
  return http.post("/admin/movies", formData).then((res) => res.data.result);
};

export const updateMovie = (movieId, formData) => {
  return http.put(`/admin/movies/${movieId}`, formData).then((res) => res.data.result);
};

export const deleteMovie = (movieId) => {
  return http.delete(`/admin/movies/${movieId}`).then((res) => res.data.result);
};
