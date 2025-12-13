import { http } from "../../../utils/baseUrl";

export const getAllBookingsForAdmin = (page, size, filters = {}) => {
  const { userId, showId, status, fromDate, toDate } = filters;

  const params = {};

  if (userId) params.userId = userId;
  if (showId) params.showId = showId;
  if (status) params.status = status;
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;

  return http
    .get(`/admin/bookings/getAllBookings/${page}/${size}`, { params })
    .then((res) => res.data.result);
};

export const getBookingById = (bookingId) => {
  return http
    .get(`/admin/bookings/${bookingId}`)
    .then((res) => res.data.result);
};

export const cancelBooking = (bookingId) => {
  return http
    .put(`/admin/bookings/${bookingId}/cancel`)
    .then((res) => res.data.result);
};

export const confirmBooking = (bookingId) => {
  return http
    .put(`/admin/bookings/${bookingId}/confirm`)
    .then((res) => res.data.result);
};

export const getBookingStatistics = (fromDate, toDate) => {
  return http
    .get("/admin/bookings/statistics", {
      params: {
        fromDate: fromDate || null,
        toDate: toDate || null,
      },
    })
    .then((res) => res.data.result);
};

export const getRevenueByDate = (fromDate, toDate) => {
  return http
    .get("/admin/bookings/revenue-by-date", {
      params: {
        fromDate: fromDate || null,
        toDate: toDate || null,
      },
    })
    .then((res) => res.data.result);
};

export const getTopMovies = (fromDate, toDate, limit = 10) => {
  return http
    .get("/admin/bookings/top-movies", {
      params: {
        fromDate: fromDate || null,
        toDate: toDate || null,
        limit,
      },
    })
    .then((res) => res.data.result);
};
