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
} = AdminReducer.actions;

export default AdminReducer.reducer;
