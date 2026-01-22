import { authHttp } from "../../../utils/baseUrl";

export const getAllMoviesForAdmin = (page, size, search) => {
  return authHttp
    .get(`/admin/movies/getAllMovies/${page}/${size}`, {
      params: { search },
    })
    .then((res) => res.data.result);
};

export const createMovie = (formData) => {
  return authHttp.post("/admin/movies", formData).then((res) => res.data.result);
};

export const updateMovie = (movieId, formData) => {
  return authHttp.put(`/admin/movies/${movieId}`, formData).then((res) => res.data.result);
};

export const deleteMovie = (movieId) => {
  return authHttp.delete(`/admin/movies/${movieId}`).then((res) => res.data.result);
};
