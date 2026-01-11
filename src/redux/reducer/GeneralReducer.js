// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { search } from "../../service/GeneralService";

// export const searchApi = createAsyncThunk(
//   "GeneralReducer/searchApi",
//   async (keyword, { rejectWithValue }) => {
//     try {
//       console.log("🔍 Redux searchApi called with:", keyword);
//       const res = await search(keyword);
//       console.log("✅ Redux received result:", res);
//       console.log("📊 Type of result:", typeof res);
//       console.log("🔢 Is Array:", Array.isArray(res));
//       return res;
//     } catch (error) {
//       console.error("❌ Redux error:", error);
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   dataSearch: [],
//   loading: false,
//   error: null,
// };

// const GeneralReducer = createSlice({
//   name: "GeneralReducer",
//   initialState,
//   reducers: {
//     clearSearch: (state) => {
//       state.dataSearch = [];
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(searchApi.pending, (state) => {
//         console.log("⏳ Search PENDING");
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(searchApi.fulfilled, (state, action) => {
//         console.log("✅ Search FULFILLED with payload:", action.payload);
//         state.dataSearch = action.payload;
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(searchApi.rejected, (state, action) => {
//         console.error("❌ Search REJECTED:", action.payload);
//         state.loading = false;
//         state.error = action.payload || "Có lỗi xảy ra!";
//         state.dataSearch = [];
//       });
//   },
// });

// export const { clearSearch } = GeneralReducer.actions;
// export default GeneralReducer.reducer;

// ✅ SỬA FILE: GeneralReducer.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { search } from "../../service/GeneralService";
import { getMovieRecommendations } from "../../service/MovieRecommendationService";

export const searchApi = createAsyncThunk(
  "GeneralReducer/searchApi",
  async (keyword, { rejectWithValue }) => {
    try {
      const res = await search(keyword);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ THÊM: Action lấy recommendations
export const getRecommendationsApi = createAsyncThunk(
  "GeneralReducer/getRecommendationsApi",
  async ({ movieId, limit = 4 }, { rejectWithValue }) => {
    try {
      console.log("🎯 Fetching AI recommendations for movie:", movieId);
      const res = await getMovieRecommendations(movieId, limit);
      console.log("✅ Recommendations received:", res);
      return res;
    } catch (error) {
      console.error("❌ Recommendations error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  dataSearch: [],
  recommendations: [], // ✅ THÊM
  recommendationsLoading: false, // ✅ THÊM
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
    clearRecommendations: (state) => {
      // ✅ THÊM
      state.recommendations = [];
      state.recommendationsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search cases
      .addCase(searchApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchApi.fulfilled, (state, action) => {
        state.dataSearch = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(searchApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra!";
        state.dataSearch = [];
      })
      // ✅ THÊM: Recommendations cases
      .addCase(getRecommendationsApi.pending, (state) => {
        state.recommendationsLoading = true;
      })
      .addCase(getRecommendationsApi.fulfilled, (state, action) => {
        state.recommendations = action.payload;
        state.recommendationsLoading = false;
      })
      .addCase(getRecommendationsApi.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = [];
        state.error = action.payload;
      });
  },
});

export const { clearSearch, clearRecommendations } = GeneralReducer.actions;
export default GeneralReducer.reducer;
