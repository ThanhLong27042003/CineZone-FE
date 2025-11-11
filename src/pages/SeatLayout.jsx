import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
} from "lucide-react";

import { assets } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import { Seat } from "../components/Seat";
import { CountdownBanner } from "../components/CountdownBanner";

import { getMovieByIdApi } from "../redux/reducer/FilmReducer";
import { getAllSeatApi } from "../redux/reducer/SeatReducer";
import { seatsManagement } from "../../utils/seatsManagement";
import { webSocket } from "../../utils/webSocket";
import { useAuth } from "../context/AuthContext";
import { http } from "../../utils/baseUrl";

const SeatLayout = () => {
  const { movieId, showId, date, time } = useParams();
  const [show, setShow] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myInfo } = useAuth();

  const movie = useSelector((state) => state.FilmReducer.film);
  const seats = useSelector((state) => state.SeatReducer.seats);

  const {
    selectedSeats,
    occupiedSeats,
    seatCountdowns,
    handleSeatUpdate,
    handleSeatClick,
    releaseSeatWhenCloseTab,
  } = seatsManagement(showId, myInfo);

  webSocket(showId, handleSeatUpdate);

  const handlePayment = useCallback(async () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }
    try {
      const { data } = await http.post("/seat/book", {
        showId: parseInt(showId),
        seatNumbers: selectedSeats.map((seat) => seat.seatNumber),
        userId: myInfo?.id,
      });
      if (data.result.success) {
      }
    } catch (err) {
      toast.error(err);
    }
  });
  useEffect(() => {
    if (movieId && !movie) dispatch(getMovieByIdApi(movieId));
    if (movieId) dispatch(getAllSeatApi());
  }, [dispatch, movieId]);

  useEffect(() => {
    if (movie) {
      setShow({ movie, date, time });
    }
  }, [movie, date, time]);

  // ==================== RELEASE SEATS ON TAB CLOSE ====================
  useEffect(() => {
    let isRelease = false;
    const handleBeforeUnload = (event) => {
      if (selectedSeats.length === 0) return;
      event.preventDefault();
      isRelease = true;
      return event.returnValue;
    };
    const handleUnload = () => {
      if (isRelease) {
        releaseSeatWhenCloseTab();
      } else {
        return;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [releaseSeatWhenCloseTab]);

  const renderSeatRow = (row, numbers) => (
    <div key={row} className="flex gap-2 justify-center">
      <span className="w-6 text-center text-gray-400 font-medium">{row}</span>
      <div className="flex gap-2">
        {numbers.map((_, i) => {
          const seatId = `${row}${i + 1}`;
          const selectedSeat = selectedSeats.find(
            (s) => s.seatNumber === seatId
          );
          const occupiedSeat = occupiedSeats.find(
            (s) => s.seatNumber === seatId
          );
          const isSelected = selectedSeat?.status === "HELD";
          const isBooked = selectedSeat?.status === "BOOKED";
          const isHeldByOthers = occupiedSeat?.status === "HELD" && !isSelected;
          const isBookByOthers = occupiedSeat?.status === "BOOKED" && !isBooked;
          const countdown = seatCountdowns[seatId]
            ? Math.max(
                0,
                Math.floor((seatCountdowns[seatId] - Date.now()) / 1000)
              )
            : 0;

          return (
            <Seat
              key={seatId}
              seatId={seatId}
              number={i + 1}
              isSelected={isSelected}
              isBooked={isBooked}
              isHeldByOthers={isHeldByOthers}
              isBookByOthers={isBookByOthers}
              countdown={countdown}
              onClick={async (id) => {
                const success = await handleSeatClick(id);
                if (!success && !myInfo) {
                  navigate("/login");
                }
              }}
            />
          );
        })}
      </div>
      <span className="w-6 text-center text-gray-400 font-medium">{row}</span>
    </div>
  );

  const groupSeatsByRow = (vipLevel) =>
    seats
      .filter((seat) => seat.vip === vipLevel)
      .reduce((acc, seat) => {
        const row = seat.seatNumber[0];
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat.seatNumber.slice(1));
        return acc;
      }, {});

  const totalPrice = selectedSeats.length * 120000;

  if (!show) return <Loading />;

  return (
    <div className="min-h-screen">
      <BlurCircle top="100px" left="200px" />
      <BlurCircle top="400px" right="100px" />
      <BlurCircle bottom="200px" left="50%" />

      {selectedSeats.length !== 0 && (
        <CountdownBanner
          seatCountdowns={seatCountdowns}
          selectedSeatsCount={selectedSeats.length}
          onPayment={handlePayment}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-8 px-6 md:px-11 lg:px-15 xl:px-20 py-32">
        {/* ==================== SIDEBAR INFO ==================== */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-80 space-y-6"
        >
          {/* Movie Info */}
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <img
              src={show.movie.backdropPath}
              alt={show.movie.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-bold text-white mb-2">
              {show.movie.title}
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span>{date.split("-").reverse().join("-")}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-primary" />
                <span>{time.split(":").slice(0, 2).join(":")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-primary" />
                <span>Cinema Hall 1</span>
              </div>
            </div>
          </div>

          {/* Seat Legend */}
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Seat Legend
            </h3>
            <div className="space-y-3">
              {[
                {
                  color: "bg-gray-800 border border-gray-600",
                  label: "Available",
                },
                {
                  color: "bg-gradient-to-br from-primary to-primary-dull",
                  label: "Selected",
                },
                { color: "bg-gray-600", label: "Held by others" },
                { color: "bg-green-600", label: "Booked" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-6 h-6 ${color} rounded-lg`} />
                  <span className="text-sm text-gray-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Selected Seats
              </h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedSeats.map((seat) => {
                  const timeRemaining = seatCountdowns[seat.seatNumber]
                    ? Math.max(
                        0,
                        Math.floor(
                          (seatCountdowns[seat.seatNumber] - Date.now()) / 1000
                        )
                      )
                    : 0;

                  return (
                    <div
                      key={seat.seatNumber}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-semibold">
                        {seat.seatNumber}
                      </span>
                      {timeRemaining > 0 && (
                        <span
                          className={`text-xs font-mono ${
                            timeRemaining <= 30
                              ? "text-red-400 animate-pulse"
                              : "text-gray-400"
                          }`}
                        >
                          {Math.floor(timeRemaining / 60)}:
                          {(timeRemaining % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between text-white">
                  <span>Total ({selectedSeats.length} seats)</span>
                  <span className="font-bold">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ==================== SEAT SELECTION AREA ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col items-center"
        >
          <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Select Your Seats
              </h1>
              <p className="text-gray-400">
                Choose your preferred seats for the best experience
              </p>
            </div>

            {/* Screen */}
            <div className="relative mb-12">
              <img
                src={assets.screenImage}
                alt="screen"
                className="w-full max-w-2xl mx-auto"
              />
              <p className="text-center text-gray-400 text-sm mt-3 font-medium tracking-wider">
                SCREEN
              </p>
            </div>

            {/* ✅ THAY ĐỔI: Refactor seat grid rendering */}
            <div className="space-y-6">
              {/* Premium Seats */}
              <div className="space-y-2">
                <h3 className="text-center text-yellow-400 text-sm font-semibold mb-3">
                  PREMIUM
                </h3>
                {Object.entries(groupSeatsByRow(1)).map(([row, numbers]) =>
                  renderSeatRow(row, numbers)
                )}
              </div>

              <div className="h-6" />

              {/* Standard Seats */}
              <div>
                <h3 className="text-center text-blue-400 text-sm font-semibold mb-3">
                  STANDARD
                </h3>
                <div className="flex justify-center gap-4">
                  {[0, -3].map((sliceIndex) => (
                    <div key={sliceIndex} className="space-y-2">
                      {Object.entries(groupSeatsByRow(2))
                        [sliceIndex === 0 ? "slice" : "slice"](
                          sliceIndex === 0 ? 0 : sliceIndex,
                          sliceIndex === 0 ? 3 : undefined
                        )
                        .map(([row, numbers]) => renderSeatRow(row, numbers))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-6" />

              {/* Back Seats */}
              <div className="space-y-2">
                <h3 className="text-center text-gray-400 text-sm font-semibold mb-3">
                  BACK
                </h3>
                {Object.entries(groupSeatsByRow(3)).map(([row, numbers]) =>
                  renderSeatRow(row, numbers)
                )}
              </div>
            </div>

            {/* Checkout Button */}
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => {
                  if (selectedSeats.length === 0) {
                    return toast.error("Please select at least one seat");
                  }
                  navigate("/payment", {
                    state: {
                      selectedSeats,
                      showId,
                      totalPrice,
                      userId: myInfo?.id,
                    },
                  });
                }}
                disabled={selectedSeats.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
                  ${
                    selectedSeats.length > 0
                      ? "bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary text-white shadow-xl shadow-primary/30"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <UsersIcon className="w-5 h-5" />
                Proceed to Checkout
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SeatLayout;
