import {
  createSlice,
  createAsyncThunk,
  isFulfilled,
  isRejected,
  isPending,
} from "@reduxjs/toolkit";
import {
  getFavoriteMovie,
  getMovieForPage,
  getTopMovieForHomePage,
  isLiked,
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

export const getMovieForPageApi = createAsyncThunk(
  "FilmReducer/getMovieForPageApi",
  async ({ page, size }) => {
    console.log("🚀 Fetching movies for page:", page, "size:", size);
    const res = await getMovieForPage(page, size);
    console.log("✅ Received response:", res);
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
export const getFavoriteMovieApi = createAsyncThunk(
  "FilmReducer/getFavoriteMovieApi",
  async (userId) => {
    const res = await getFavoriteMovie(userId);
    return res;
  }
);

export const isLikedApi = createAsyncThunk(
  "FilmReducer/isLikedApi",
  async ({ userId, movieId }) => {
    const res = await isLiked(userId, movieId);
    return res;
  }
);

const initialState = {
  film: null,
  arrFilm: [],
  filmsByGenre: [],
  filmForPage: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 20,
    number: 0,
  },
  favoriteFilms: [],
  checkLiked: false,
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
      .addCase(getFavoriteMovieApi.fulfilled, (state, action) => {
        state.favoriteFilms = action.payload;
      })
      .addCase(getMovieForPageApi.fulfilled, (state, action) => {
        state.filmForPage = action.payload;
      })
      .addCase(isLikedApi.fulfilled, (state, action) => {
        state.checkLiked = action.payload;
      })
      .addMatcher(
        isPending(
          getAllMovieApi,
          getMovieByIdApi,
          getTopMovieForHomePageApi,
          getMovieForPageApi,
          getFavoriteMovieApi,
          isLikedApi
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isFulfilled(
          getAllMovieApi,
          getMovieByIdApi,
          getTopMovieForHomePageApi,
          getMovieForPageApi,
          getFavoriteMovieApi,
          isLikedApi
        ),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isRejected(
          getAllMovieApi,
          getMovieByIdApi,
          getTopMovieForHomePageApi,
          getMovieForPageApi,
          getFavoriteMovieApi,
          isLikedApi
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default FilmReducer.reducer;
