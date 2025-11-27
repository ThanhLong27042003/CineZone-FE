import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllCast } from "../../service/CastService";

const getAllCastApi = createAsyncThunk(
  "CastReducer/getAllCastApi",
  async () => {
    return (res = await getAllCast());
  }
);

const initialState = {
  arrCast: [],
  loading: false,
  error: null,
};

const CastReducer = createSlice({
  name: "getAllCastApi",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllCastApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCastApi.fulfilled, (state, action) => {
        (state.loading = false), (state.arrCast = action.payload);
      })
      .addCase(getAllCastApi.rejected, (state, action) => {
        (state.loading = false), (state.error = action.error.message);
      });
  },
});

export default CastReducer.reducer;
