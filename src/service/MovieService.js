import { authHttp, http } from "../../utils/baseUrl";

export const laydanhsachphim = () => {
  return http.get("/movie/getAllMovie").then((res) => res.data.result);
};

export const themphim = (formData) => {
  return http.post("/movie/createMovie", formData);
};

export const laythongtinphim = (maPhim) => {
  return http.get(`/movie/${maPhim}`).then((res) => res.data.result);
};

export const capnhatPhim = (maPhim, formData) => {
  return http.put(`/movie/updateMovie/${maPhim}`, formData);
};

export const xoahim = (maPhim) => {
  return http.delete(`/movie/deleteMovie/${maPhim}`);
};

export const getTopMovieForHomePage = (genres) => {
  return http
    .get(`/movie/getTopMovieForHomePage/${genres}`)
    .then((res) => res.data.result);
};

export const getMovieForPage = (page, size) => {
  return http
    .get(`/movie/getMovieForPage/${page}/${size}`)
    .then((res) => res.data.result);
};

export const getFavoriteMovie = (userId) => {
  return http
    .get(`/movie/getFavoriteMovie/${userId}`)
    .then((res) => res.data.result);
};

export const isLiked = (userId, movieId) => {
  return http
    .get(`/movie/isLiked/${userId}/${movieId}`)
    .then((res) => res.data.result);
};

