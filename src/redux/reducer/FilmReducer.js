import {
  createSlice,
  createAsyncThunk,
  isFulfilled,
  isRejected,
  isPending,
} from "@reduxjs/toolkit";
import {
  getTopMovieForHomePage,
  laydanhsachphim,
  laythongtinphim,
} from "../../service/MovieService";

export const getAllMovieApi = createAsyncThunk(
  "FilmReducer/getAllMovieApi",
  async () => {
    const res = await laydanhsachphim();
    return res;
  }
);

export const getMovieByIdApi = createAsyncThunk(
  "FilmReducer/getMovieByIdApi",
  async (movieId) => {
    const res = await laythongtinphim(movieId);
    return res;
  }
);

export const getTopMovieForHomePageApi = createAsyncThunk(
  "FilmReducer/getTopMovieForHomePageApi",
  async (genres) => {
    const res = await getTopMovieForHomePage(genres);
    return res;
  }
);

const initialState = {
  film: null,
  arrFilm: [],
  filmsByGenre: [],
  loading: true,
  error: null,
};

const FilmReducer = createSlice({
  name: "FilmReducer",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getMovieByIdApi.fulfilled, (state, action) => {
        state.film = action.payload;
      })
      .addCase(getAllMovieApi.fulfilled, (state, action) => {
        state.arrFilm = action.payload;
      })
      .addCase(getTopMovieForHomePageApi.fulfilled, (state, action) => {
        state.filmsByGenre = action.payload;
      })
      .addMatcher(
        isPending(getAllMovieApi, getMovieByIdApi, getTopMovieForHomePageApi),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isFulfilled(getAllMovieApi, getMovieByIdApi, getTopMovieForHomePageApi),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isRejected(getAllMovieApi, getMovieByIdApi, getTopMovieForHomePageApi),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default FilmReducer.reducer;
