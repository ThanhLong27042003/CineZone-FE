import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import Title from "./Title";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilm,
  FaCheck,
  FaTimes,
  FaStar,
  FaCalendarAlt,
  FaDollarSign,
  FaPlus,
  FaDoorOpen,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getAllMoviesForAdmin } from "../../service/admin/MovieService";
import { getAllRooms } from "../../service/admin/RoomService";
import { createShow } from "../../service/admin/ShowService"; // ✅ Import createShow

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPrice, setShowPrice] = useState("");
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [moviesRes, roomsRes] = await Promise.all([
        getAllMoviesForAdmin(0, 5, null),
        getAllRooms(),
      ]);

      setMovies(moviesRes.content || []);
      setRooms(roomsRes || []);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) {
      toast.error("Please select a date and time");
      return;
    }

    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      toast.error("This time slot is already added");
      return prev;
    });
    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedMovie) {
      toast.error("Please select a movie");
      return;
    }
    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }
    if (!showPrice || parseFloat(showPrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (Object.keys(dateTimeSelection).length === 0) {
      toast.error("Please add at least one show time");
      return;
    }

    setSubmitting(true);
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    try {
      // Create shows for each date/time combination
      const promises = [];

      for (const [date, times] of Object.entries(dateTimeSelection)) {
        for (const time of times) {
          // ✅ Tạo formData theo đúng format API yêu cầu
          const formData = {
            movieId: selectedMovie,
            roomId: selectedRoom,
            showDate: date, // "2025-12-14" (LocalDate)
            showTime: time, // "14:30" (LocalTime)
            price: parseFloat(showPrice),
          };

          // ✅ Sử dụng createShow từ ShowService
          const promise = createShow(formData)
            .then((result) => {
              successCount++;
              return { success: true, date, time };
            })
            .catch((error) => {
              failCount++;
              const errorMsg =
                error.response?.data?.message || "Failed to create show";
              errors.push(`${date} ${time}: ${errorMsg}`);
              return { success: false, date, time, error: errorMsg };
            });

          promises.push(promise);
        }
      }

      await Promise.all(promises);

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} show(s)!`, {
          duration: 4000,
        });
      }

      if (failCount > 0) {
        toast.error(
          `Failed to create ${failCount} show(s). Check for overlaps or conflicts.`,
          { duration: 5000 }
        );

        // Show specific errors (max 3)
        if (errors.length > 0 && errors.length <= 3) {
          errors.forEach((err) => {
            toast.error(err, { duration: 4000 });
          });
        }
      }

      // Reset form if all succeeded
      if (failCount === 0) {
        setSelectedMovie(null);
        setSelectedRoom(null);
        setShowPrice("");
        setDateTimeSelection({});
        setDateTimeInput("");
      }
    } catch (error) {
      toast.error("An error occurred while creating shows");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      <Title text1="Add" text2="Shows" icon={FaFilm} />

      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 mb-8 flex-wrap"
      >
        {[
          { step: 1, label: "Select Movie", active: true },
          { step: 2, label: "Select Room", active: !!selectedMovie },
          { step: 3, label: "Set Price", active: !!selectedRoom },
          { step: 4, label: "Schedule", active: !!showPrice },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                item.active
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {item.step}
            </motion.div>
            <span
              className={`font-medium ${
                item.active
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
            {idx < 3 && (
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Movies Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Select Movie
          </h2>
          <span className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
            {movies.length} Movies
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => setSelectedMovie(movie.id)}
              className={`relative cursor-pointer group ${
                selectedMovie === movie.id
                  ? "ring-4 ring-purple-500 rounded-xl"
                  : ""
              }`}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={movie.posterPath || "/placeholder.jpg"}
                  alt={movie.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-white text-sm font-bold">
                    {movie.voteAverage?.toFixed(1) || "N/A"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 backdrop-blur-sm">
                  <p className="text-white text-xs text-center">
                    {movie.runtime || "N/A"} min • {movie.releaseDate || "N/A"}
                  </p>
                </div>

                <AnimatePresence>
                  {selectedMovie === movie.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500
                               flex items-center justify-center shadow-lg"
                    >
                      <FaCheck className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-2">
                <p className="font-bold text-gray-800 dark:text-white truncate">
                  {movie.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {movie.releaseDate || "N/A"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Room Selection */}
      {selectedMovie && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <label className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800 dark:text-white">
            <FaDoorOpen className="text-blue-500" />
            Select Room
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRoom(room.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  selectedRoom === room.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedRoom === room.id
                        ? "bg-blue-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <FaDoorOpen
                      className={`text-xl ${
                        selectedRoom === room.id
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {room.name}
                    </h4>
                    {room.capacity && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Capacity: {room.capacity}
                      </p>
                    )}
                  </div>
                  {selectedRoom === room.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <FaCheck className="text-white text-xs" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FaDoorOpen className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No rooms available. Please create rooms first.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Price Input */}
      {selectedRoom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <label className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800 dark:text-white">
            <FaDollarSign className="text-green-500" />
            Show Price
          </label>
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              {currency}
            </span>
            <input
              min={0}
              step="0.01"
              type="number"
              value={showPrice}
              onChange={(e) => setShowPrice(e.target.value)}
              placeholder="Enter show price"
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700 focus:border-purple-500 outline-none
                       text-lg font-medium transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* DateTime Selection */}
      {showPrice && parseFloat(showPrice) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <label className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800 dark:text-white">
            <FaCalendarAlt className="text-blue-500" />
            Select Date and Time
          </label>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
              className="flex-1 px-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-700 focus:border-purple-500 outline-none
                       transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDateTimeAdd}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
                       text-white font-bold shadow-lg hover:shadow-xl transition-all
                       flex items-center gap-2 justify-center"
            >
              <FaPlus /> Add Time
            </motion.button>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-700">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 dark:text-yellow-400 text-xl">
                ⚠️
              </div>
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Overlap Detection
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  The system will automatically check for overlapping shows in
                  the same room. If a time slot overlaps, it will be rejected.
                </p>
              </div>
            </div>
          </div>

          {/* Selected Times */}
          <AnimatePresence>
            {Object.keys(dateTimeSelection).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-gray-800 dark:text-white">
                  Selected Show Times (
                  {Object.values(dateTimeSelection).flat().length} total)
                </h3>
                {Object.entries(dateTimeSelection).map(([date, times]) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700"
                  >
                    <div className="font-bold text-purple-700 dark:text-purple-300 mb-3">
                      📅 {date}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {times.map((time) => (
                        <motion.div
                          key={time}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg
                                   bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-600
                                   shadow-md group"
                        >
                          <span className="font-medium">⏰ {time}</span>
                          <motion.button
                            whileHover={{ rotate: 90 }}
                            onClick={() => handleRemoveTime(date, time)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTimes />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Submit Button */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto px-12 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500
                   text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all
                   flex items-center gap-3 justify-center mx-auto
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaCheck />
          {submitting
            ? "Creating Shows..."
            : `Add ${Object.values(dateTimeSelection).flat().length} Show(s)`}
        </motion.button>
      )}
    </div>
  );
};

export default AddShows;
