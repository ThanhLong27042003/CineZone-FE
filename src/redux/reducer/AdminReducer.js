// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   users: {
//     data: [],
//     totalPages: 0,
//     currentPage: 0,
//     loading: false,
//     error: null,
//   },
//   movies: {
//     data: [],
//     totalPages: 0,
//     currentPage: 0,
//     loading: false,
//     error: null,
//   },
//   shows: {
//     data: [],
//     totalPages: 0,
//     currentPage: 0,
//     loading: false,
//     error: null,
//   },
// };

// const AdminReducer = createSlice({
//   name: "admin",
//   initialState,
//   reducers: {
//     // Users
//     setUsers: (state, action) => {
//       state.users.data = action.payload.content;
//       state.users.totalPages = action.payload.totalPages;
//       state.users.currentPage = action.payload.number;
//       state.users.loading = false;
//     },
//     setUsersLoading: (state, action) => {
//       state.users.loading = action.payload;
//     },
//     setUsersError: (state, action) => {
//       state.users.error = action.payload;
//       state.users.loading = false;
//     },

//     // Movies
//     setMovies: (state, action) => {
//       state.movies.data = action.payload.content;
//       state.movies.totalPages = action.payload.totalPages;
//       state.movies.currentPage = action.payload.number;
//       state.movies.loading = false;
//     },
//     setMoviesLoading: (state, action) => {
//       state.movies.loading = action.payload;
//     },
//     setMoviesError: (state, action) => {
//       state.movies.error = action.payload;
//       state.movies.loading = false;
//     },

//     // Shows
//     setShows: (state, action) => {
//       state.shows.data = action.payload.content;
//       state.shows.totalPages = action.payload.totalPages;
//       state.shows.currentPage = action.payload.number;
//       state.shows.loading = false;
//     },
//     setShowsLoading: (state, action) => {
//       state.shows.loading = action.payload;
//     },
//     setShowsError: (state, action) => {
//       state.shows.error = action.payload;
//       state.shows.loading = false;
//     },
//   },
// });

// export const {
//   setUsers,
//   setUsersLoading,
//   setUsersError,
//   setMovies,
//   setMoviesLoading,
//   setMoviesError,
//   setShows,
//   setShowsLoading,
//   setShowsError,
// } = AdminReducer.actions;

// export default AdminReducer.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {
    data: [],
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
  movies: {
    data: [],
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
  shows: {
    data: [],
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
  bookings: {
    data: [],
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
    statistics: null,
  },
  analytics: {
    revenueByDate: [],
    topMovies: [],
    loading: false,
    error: null,
  },
};

const AdminReducer = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Users
    setUsers: (state, action) => {
      state.users.data = action.payload.content;
      state.users.totalPages = action.payload.totalPages;
      state.users.currentPage = action.payload.number;
      state.users.loading = false;
    },
    setUsersLoading: (state, action) => {
      state.users.loading = action.payload;
    },
    setUsersError: (state, action) => {
      state.users.error = action.payload;
      state.users.loading = false;
    },

    // Movies
    setMovies: (state, action) => {
      state.movies.data = action.payload.content;
      state.movies.totalPages = action.payload.totalPages;
      state.movies.currentPage = action.payload.number;
      state.movies.loading = false;
    },
    setMoviesLoading: (state, action) => {
      state.movies.loading = action.payload;
    },
    setMoviesError: (state, action) => {
      state.movies.error = action.payload;
      state.movies.loading = false;
    },

    // Shows
    setShows: (state, action) => {
      state.shows.data = action.payload.content;
      state.shows.totalPages = action.payload.totalPages;
      state.shows.currentPage = action.payload.number;
      state.shows.loading = false;
    },
    setShowsLoading: (state, action) => {
      state.shows.loading = action.payload;
    },
    setShowsError: (state, action) => {
      state.shows.error = action.payload;
      state.shows.loading = false;
    },

    // Bookings
    setBookings: (state, action) => {
      state.bookings.data = action.payload.content;
      state.bookings.totalPages = action.payload.totalPages;
      state.bookings.currentPage = action.payload.number;
      state.bookings.loading = false;
    },
    setBookingsLoading: (state, action) => {
      state.bookings.loading = action.payload;
    },
    setBookingsError: (state, action) => {
      state.bookings.error = action.payload;
      state.bookings.loading = false;
    },
    setBookingStatistics: (state, action) => {
      state.bookings.statistics = action.payload;
    },

    // Analytics
    setRevenueByDate: (state, action) => {
      state.analytics.revenueByDate = action.payload;
      state.analytics.loading = false;
    },
    setTopMovies: (state, action) => {
      state.analytics.topMovies = action.payload;
      state.analytics.loading = false;
    },
    setAnalyticsLoading: (state, action) => {
      state.analytics.loading = action.payload;
    },
    setAnalyticsError: (state, action) => {
      state.analytics.error = action.payload;
      state.analytics.loading = false;
    },
  },
});

export const {
  setUsers,
  setUsersLoading,
  setUsersError,
  setMovies,
  setMoviesLoading,
  setMoviesError,
  setShows,
  setShowsLoading,
  setShowsError,
  setBookings,
  setBookingsLoading,
  setBookingsError,
  setBookingStatistics,
  setRevenueByDate,
  setTopMovies,
  setAnalyticsLoading,
  setAnalyticsError,
} = AdminReducer.actions;

export default AdminReducer.reducer;
