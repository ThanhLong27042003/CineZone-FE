import {
  createSlice,
  createAsyncThunk,
  isFulfilled,
  isRejected,
  isPending,
} from "@reduxjs/toolkit";
import {
  getMovieForPage,
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

export const getMovieForPageApi = createAsyncThunk(
  "FilmReducer/getMovieForPageApi",
  async ({ page, size }) => {
    console.log("🚀 Fetching movies for page:", page, "size:", size);
    const res = await getMovieForPage(page, size);
    console.log("✅ Received response:", res);
    return res; // ← res đã là object {content, totalPages, ...}
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
  filmForPage: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 20,
    number: 0,
  },
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
      .addCase(getMovieForPageApi.fulfilled, (state, action) => {
        console.log("📦 Redux storing filmForPage:", action.payload);
        state.filmForPage = action.payload; // ← Lưu toàn bộ object
      })
      .addMatcher(
        isPending(
          getAllMovieApi,
          getMovieByIdApi,
          getTopMovieForHomePageApi,
          getMovieForPageApi
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
          getMovieForPageApi
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
          getMovieForPageApi
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default FilmReducer.reducer;
