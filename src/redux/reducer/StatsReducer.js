import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllStats,
  getCinemaStats,
  getTrendingMovies,
  getComingSoonMovies,
  getCinemaInfo,
} from "../../service/StatsService";

// Async thunks
export const getAllStatsApi = createAsyncThunk(
  "StatsReducer/getAllStatsApi",
  async () => {
    const res = await getAllStats();
    return res;
  }
);

export const getCinemaStatsApi = createAsyncThunk(
  "StatsReducer/getCinemaStatsApi",
  async () => {
    const res = await getCinemaStats();
    return res;
  }
);

export const getTrendingMoviesApi = createAsyncThunk(
  "StatsReducer/getTrendingMoviesApi",
  async () => {
    const res = await getTrendingMovies();
    return res;
  }
);

export const getComingSoonMoviesApi = createAsyncThunk(
  "StatsReducer/getComingSoonMoviesApi",
  async () => {
    const res = await getComingSoonMovies();
    return res;
  }
);

export const getCinemaInfoApi = createAsyncThunk(
  "StatsReducer/getCinemaInfoApi",
  async () => {
    const res = await getCinemaInfo();
    return res;
  }
);

const initialState = {
  allStats: null,
  cinemaStats: null,
  trendingMovies: [],
  comingSoonMovies: [],
  cinemaInfo: null,
  loading: false,
  error: null,
};

const StatsReducer = createSlice({
  name: "StatsReducer",
  initialState,
  extraReducers: (builder) => {
    builder
      // Get all stats
      .addCase(getAllStatsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStatsApi.fulfilled, (state, action) => {
        state.loading = false;
        state.allStats = action.payload;
        // Also populate individual fields
        if (action.payload.stats) {
          state.cinemaStats = action.payload.stats;
        }
        if (action.payload.trendingMovies) {
          state.trendingMovies = action.payload.trendingMovies;
        }
        if (action.payload.comingSoon) {
          state.comingSoonMovies = action.payload.comingSoon;
        }
        if (action.payload.cinemaInfo) {
          state.cinemaInfo = action.payload.cinemaInfo;
        }
      })
      .addCase(getAllStatsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get cinema stats
      .addCase(getCinemaStatsApi.fulfilled, (state, action) => {
        state.cinemaStats = action.payload;
      })

      // Get trending movies
      .addCase(getTrendingMoviesApi.fulfilled, (state, action) => {
        state.trendingMovies = action.payload;
      })

      // Get coming soon movies
      .addCase(getComingSoonMoviesApi.fulfilled, (state, action) => {
        state.comingSoonMovies = action.payload;
      })

      // Get cinema info
      .addCase(getCinemaInfoApi.fulfilled, (state, action) => {
        state.cinemaInfo = action.payload;
      });
  },
});
export default StatsReducer.reducer;
