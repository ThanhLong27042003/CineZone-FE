import { authHttp } from "../../../utils/baseUrl";

export const getAllShowsForAdmin = (page, size, search) => {
  return authHttp
    .get(`/admin/shows/getAllShows/${page}/${size}`, {
      params: { search },
    })
    .then((res) => res.data.result);
};

export const createShow = (formData) => {
  return authHttp.post("/admin/shows", formData).then((res) => res.data.result);
};

export const updateShow = (showId, formData) => {
  return authHttp
    .put(`/admin/shows/${showId}`, formData)
    .then((res) => res.data.result);
};

export const deleteShow = (showId) => {
  return authHttp
    .delete(`/admin/shows/${showId}`)
    .then((res) => res.data.result);
};
