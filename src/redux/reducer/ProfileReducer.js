import {
  createSlice,
  createAsyncThunk,
  isFulfilled,
  isRejected,
  isPending,
} from "@reduxjs/toolkit";
import {
  addFavoriteMovie,
  removeFavoriteMovie,
} from "../../service/ProfileService";

export const addFavoriteMovieApi = createAsyncThunk(
  "ProfileReducer/addFavoriteMovieApi",
  async ({ userId, movieId }) => {
    const res = await addFavoriteMovie(userId, movieId);
    return res;
  }
);

export const removeFavoriteMovieApi = createAsyncThunk(
  "ProfileReducer/removeFavoriteMovieApi",
  async ({ userId, movieId }) => {
    const res = await removeFavoriteMovie(userId, movieId);
    return res;
  }
);

const initialState = {
  addMovie: null,
  removeMovie: null,
  loading: true,
  error: null,
};

const ProfileReducer = createSlice({
  name: "ProfileReducer",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(addFavoriteMovieApi.fulfilled, (state, action) => {
        state.arrMovie = action.payload;
      })
      .addCase(removeFavoriteMovieApi.fulfilled, (state, action) => {
        state.removeMovie = action.payload;
      })
      .addMatcher(
        isPending(addFavoriteMovieApi, removeFavoriteMovieApi),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isFulfilled(addFavoriteMovieApi, removeFavoriteMovieApi),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isRejected(addFavoriteMovieApi, removeFavoriteMovieApi),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default ProfileReducer.reducer;
