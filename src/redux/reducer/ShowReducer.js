import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllShowByMovieId } from "../../service/ShowService";

export const getAllShowByMovieIdApi = createAsyncThunk(
  "ShowReducer/getAllShowByMovieIdApi",
  async (movieId) => {
    const res = await getAllShowByMovieId(movieId);
    return res;
  }
);

const initialState = {
  arrShow: [],
  loading: true,
  error: null,
};

const ShowReducer = createSlice({
  name: "ShowReducer",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllShowByMovieIdApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllShowByMovieIdApi.fulfilled, (state, action) => {
        state.loading = false;
        state.arrShow = action.payload;
      })
      .addCase(getAllShowByMovieIdApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ShowReducer.reducer;
