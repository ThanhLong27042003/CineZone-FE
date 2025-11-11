import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import {
  getAllSeat,
  getOccupiedSeat,
  getSeatsByVip,
  releaseSeat,
} from "../../service/SeatService";

export const getAllSeatApi = createAsyncThunk(
  "SeatReducer/getAllSeatApi",
  async () => {
    const res = await getAllSeat();
    return res;
  }
);

export const getSeatsByVipApi = createAsyncThunk(
  "SeatReducer/getSeatsByVipApi",

  async (vip) => {
    const res = await getSeatsByVip(vip);
    return res;
  }
);

export const getOccupiedSeatApi = createAsyncThunk(
  "SeatReducer/getOccupiedSeatApi",

  async (showId) => {
    const res = await getOccupiedSeat(showId);
    return res;
  }
);
export const releaseSeatApi = createAsyncThunk(
  "SeatReducer/releaseSeatApi",
  async (data) => {
    const res = await releaseSeat(data);
    return res;
  }
);

export const holdSeatApi = createAsyncThunk(
  "SeatReducer/holdSeatApi",
  async (data) => {
    const res = await holdSeat(data);
    return res;
  }
);

const initialState = {
  seats: [],
  seatsByVip: [],
  occupiedSeats: [],
  isReleaseSeat: false,
  isHoldSeat: false,
  loading: false,
  error: null,
};

const SeatReducer = createSlice({
  name: "SeatReducer",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllSeatApi.fulfilled, (state, action) => {
        (state.loading = false), (state.seats = action.payload);
      })
      .addCase(getSeatsByVipApi.fulfilled, (state, action) => {
        (state.loading = false), (state.seatsByVip = action.payload);
      })
      .addCase(getOccupiedSeatApi.fulfilled, (state, action) => {
        (state.loading = false), (state.occupiedSeats = action.payload);
      })
      .addCase(releaseSeatApi.fulfilled, (state, action) => {
        (state.loading = false), (state.isReleaseSeat = action.payload);
      })
      .addCase(holdSeatApi.fulfilled, (state, action) => {
        (state.loading = false), (state.isHoldSeat = action.payload);
      })
      .addMatcher(isPending(getAllSeatApi, getSeatsByVipApi), (state) => {
        state.loading = true;
      })
      .addMatcher(
        isRejected(getAllSeatApi, getSeatsByVipApi),
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      );
  },
});

export default SeatReducer.reducer;
