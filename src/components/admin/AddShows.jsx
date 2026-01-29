import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import Title from "./Title";
import {
  FaFilm,
  FaCheck,
  FaTimes,
  FaStar,
  FaCalendarAlt,
  FaDollarSign,
  FaPlus,
  FaDoorOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getAllMoviesForAdmin } from "../../service/admin/MovieService";
import { getAllRooms } from "../../service/admin/RoomService";
import { createShow } from "../../service/admin/ShowService";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchMovie, setSearchMovie] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPrice, setShowPrice] = useState("");
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchMovie);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchMovie]);

  useEffect(() => {
    fetchMovies();
  }, [debouncedSearch]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [roomsRes] = await Promise.all([
        getAllRooms(),
      ]);
      setRooms(roomsRes || []);
      // Movies will be fetched by the other useEffect
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
       // Only show specific loading for movies if not initial load
       // Or handle loading state nicely
       const response = await getAllMoviesForAdmin(0, 100, debouncedSearch || null);
       setMovies(response.content || []);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) {
      toast.error("Please select a date and time");
      return;
    }

    const inputDate = new Date(dateTimeInput);
    const now = new Date();
    
    // Validate: cannot add show in the past
    if (inputDate <= now) {
      toast.error("Cannot create show in the past. Please select a future date and time.");
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
      const promises = [];

      for (const [date, times] of Object.entries(dateTimeSelection)) {
        for (const time of times) {
          const formData = {
            movieId: selectedMovie,
            roomId: selectedRoom,
            showDate: date,
            showTime: time,
            price: parseFloat(showPrice),
          };

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

  const selectedMovieData = movies.find(m => m.id === selectedMovie);

  return (
    <div className="space-y-8">
      <Title text1="Add" text2="Shows" icon={FaFilm} />

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
        {[
          { step: 1, label: "Select Movie", active: true },
          { step: 2, label: "Select Room", active: !!selectedMovie },
          { step: 3, label: "Set Price", active: !!selectedRoom },
          { step: 4, label: "Schedule", active: !!showPrice },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                item.active
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {item.step}
            </div>
            <span
              className={`font-medium ${
                item.active ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
            {idx < 3 && <div className="w-8 h-0.5 bg-gray-300" />}
          </div>
        ))}
      </div>

      {/* Movies Grid */}
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Select Movie</h2>
          
          {/* Search Input */}
          <div className="w-full md:w-auto relative">
             <input 
                type="text"
                placeholder="Search movies..."
                value={searchMovie}
                onChange={(e) => setSearchMovie(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-lg border-2 border-gray-200 
                         focus:border-gray-500 outline-none transition-all placeholder:text-gray-400 text-gray-900"
             />
          </div>

          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium">
            {movies.length} Results
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie.id)}
              className={`relative cursor-pointer group ${
                selectedMovie === movie.id
                  ? "ring-4 ring-gray-900 rounded-xl"
                  : ""
              }`}
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={movie.posterPath || "/placeholder.jpg"}
                  alt={movie.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />

                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 flex items-center gap-1">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-white text-sm font-bold">
                    {movie.voteAverage?.toFixed(1) || "N/A"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80">
                  <p className="text-white text-xs text-center">
                    {movie.runtime || "N/A"} min • {movie.releaseDate || "N/A"}
                  </p>
                </div>

                {selectedMovie === movie.id && (
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shadow-lg">
                    <FaCheck className="text-white" />
                  </div>
                )}
              </div>

              <div className="mt-2">
                <p className="font-bold text-gray-800 truncate">{movie.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Selection */}
      {selectedMovie && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <label className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800">
            <FaDoorOpen className="text-gray-600" />
            Select Room
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedRoom === room.id
                    ? "border-gray-900 bg-gray-50 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedRoom === room.id
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FaDoorOpen className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{room.name}</h4>
                    {room.capacity && (
                      <p className="text-sm text-gray-500">
                        Capacity: {room.capacity}
                      </p>
                    )}
                  </div>
                  {selectedRoom === room.id && (
                    <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                      <FaCheck className="text-white text-xs" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FaDoorOpen className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No rooms available. Please create rooms first.</p>
            </div>
          )}
        </div>
      )}

      {/* Price Input */}
      {selectedRoom && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <label className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800">
            <FaDollarSign className="text-gray-600" />
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
              className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-300
                       bg-gray-50 focus:border-gray-500 outline-none text-lg font-medium transition-all text-gray-900"
            />
          </div>
        </div>
      )}

      {/* DateTime Selection */}
      {showPrice && parseFloat(showPrice) > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <label className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800">
            <FaCalendarAlt className="text-gray-600" />
            Select Date and Time
          </label>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="flex-1 px-4 py-4 rounded-lg border-2 border-gray-300
                       bg-gray-50 focus:border-gray-500 outline-none transition-all text-gray-900"
            />
            <button
              onClick={handleDateTimeAdd}
              className="px-8 py-4 rounded-lg bg-gray-900 text-white font-bold 
                       shadow-md hover:bg-gray-800 transition-all flex items-center gap-2 justify-center"
            >
              <FaPlus /> Add Time
            </button>
          </div>

          {/* Warning - Overlap Detection */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-600 text-xl mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">
                  Overlap Detection
                </p>
                <p className="text-sm text-yellow-700">
                  The system will automatically check for overlapping shows in
                  the same room based on movie runtime. If a time slot overlaps
                  with an existing show, it will be rejected.
                </p>
                {selectedMovieData && (
                  <p className="text-sm text-yellow-700 mt-2">
                    <strong>Selected movie runtime:</strong> {selectedMovieData.runtime || 120} minutes
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Selected Times */}
          {Object.keys(dateTimeSelection).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">
                Selected Show Times ({Object.values(dateTimeSelection).flat().length} total)
              </h3>
              {Object.entries(dateTimeSelection).map(([date, times]) => (
                <div
                  key={date}
                  className="p-4 rounded-lg bg-gray-50 border-2 border-gray-200"
                >
                  <div className="font-bold text-gray-700 mb-3">📅 {date}</div>
                  <div className="flex flex-wrap gap-2">
                    {times.map((time) => (
                      <div
                        key={time}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg
                                 bg-white border-2 border-gray-300 shadow-sm group"
                      >
                        <span className="font-medium text-gray-900">⏰ {time}</span>
                        <button
                          onClick={() => handleRemoveTime(date, time)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto px-12 py-4 rounded-lg bg-green-600 text-white 
                   font-bold text-lg shadow-md hover:bg-green-700 transition-all
                   flex items-center gap-3 justify-center mx-auto
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaCheck />
          {submitting
            ? "Creating Shows..."
            : `Add ${Object.values(dateTimeSelection).flat().length} Show(s)`}
        </button>
      )}
    </div>
  );
};

export default AddShows;
