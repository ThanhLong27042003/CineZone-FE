import { http } from "../../../utils/baseUrl";

export const getAllShowsForAdmin = (page, size, search) => {
  return http
    .get(`/admin/shows/getAllShows/${page}/${size}`, {
      params: { search },
    })
    .then((res) => res.data.result);
};

export const createShow = (formData) => {
  http.post("/admin/shows", formData).then((res) => res.data.result);
};

export const updateShow = (showId, formData) => {
  http.put(`/admin/shows/${showId}`, formData).then((res) => res.data.result);
};

export const deleteShow = (showId) => {
  return http.delete(`/admin/shows/${showId}`).then((res) => res.data.result);
};
