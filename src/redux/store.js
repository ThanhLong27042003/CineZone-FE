// store.js
import { configureStore } from "@reduxjs/toolkit";
import FilmReducer from "./reducer/FilmReducer";
import ShowReducer from "./reducer/ShowReducer";
import CastReducer from "./reducer/CastReducer";
import SeatReducer from "./reducer/SeatReducer";

// khai báo trước
const store = configureStore({
  reducer: {
    FilmReducer,
    ShowReducer,
    CastReducer,
    SeatReducer,
  },
});

// export sau
export default store;
