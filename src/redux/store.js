// store.js
import { configureStore } from "@reduxjs/toolkit";
import FilmReducer from "./reducer/FilmReducer";
import ShowReducer from "./reducer/ShowReducer";
import CastReducer from "./reducer/CastReducer";
import SeatReducer from "./reducer/SeatReducer";
import GeneralReducer from "./reducer/GeneralReducer";
import ProfileReducer from "./reducer/ProfileReducer";
import AdminReducer from "./reducer/AdminReducer";
import StatsReducer from "./reducer/StatsReducer";

const store = configureStore({
  reducer: {
    FilmReducer,
    ShowReducer,
    CastReducer,
    SeatReducer,
    GeneralReducer,
    ProfileReducer,
    admin: AdminReducer,
    StatsReducer,
  },
});

export default store;
