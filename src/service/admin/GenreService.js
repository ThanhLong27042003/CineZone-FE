import { authHttp } from "../../../utils/baseUrl";

export const getAllGenresForAdmin = () => {
  return authHttp.get("/genre/getAllGenre").then((res) => res.data.result);
};

export const createGenre = (formData) => {
  return authHttp.post("/genre", formData).then((res) => res.data.result);
};

export const updateGenre = (genreId, formData) => {
  return authHttp.put(`/genre/${genreId}`, formData).then((res) => res.data.result);
};

export const deleteGenre = (genreId) => {
  return authHttp.delete(`/genre/${genreId}`).then((res) => res.data.result);
};
