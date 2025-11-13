import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { search } from "../../service/GeneralService";

export const searchApi = createAsyncThunk(
  "GeneralReducer/searchApi",
  async (keyword, { rejectWithValue }) => {
    try {
      console.log("🔍 Redux searchApi called with:", keyword);
      const res = await search(keyword);
      console.log("✅ Redux received result:", res);
      console.log("📊 Type of result:", typeof res);
      console.log("🔢 Is Array:", Array.isArray(res));
      return res;
    } catch (error) {
      console.error("❌ Redux error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  dataSearch: [],
  loading: false,
  error: null,
};

const GeneralReducer = createSlice({
  name: "GeneralReducer",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.dataSearch = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchApi.pending, (state) => {
        console.log("⏳ Search PENDING");
        state.loading = true;
        state.error = null;
      })
      .addCase(searchApi.fulfilled, (state, action) => {
        console.log("✅ Search FULFILLED with payload:", action.payload);
        state.dataSearch = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(searchApi.rejected, (state, action) => {
        console.error("❌ Search REJECTED:", action.payload);
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra!";
        state.dataSearch = [];
      });
  },
});

export const { clearSearch } = GeneralReducer.actions;
export default GeneralReducer.reducer;
