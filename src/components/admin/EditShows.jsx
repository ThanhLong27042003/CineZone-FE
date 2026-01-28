import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import {
  FaClock,
  FaSave,
  FaTimes,
  FaFilm,
  FaCalendar,
  FaDoorOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getAllMoviesForAdmin } from "../../service/admin/MovieService";
import { updateShow } from "../../service/admin/ShowService";
import { getShowById } from "../../service/ShowService";
import { getAllRooms } from "../../service/admin/RoomService";

const EditShows = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [formData, setFormData] = useState({
    movieId: "",
    roomId: "",
    showDate: "",
    showTime: "",
    price: "",
  });
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [showId]);

  const fetchData = async () => {
    try {
      const [showResponse, moviesResponse, roomsResponse] = await Promise.all([
        getShowById(showId),
        getAllMoviesForAdmin(0, 1000, null),
        getAllRooms(),
      ]);

      const show = showResponse;
      setFormData({
        movieId: show.movieId || "",
        roomId: show.roomId || "",
        showDate: show.showDate || "",
        showTime: show.showTime || "",
        price: show.price || "",
      });
      setMovies(moviesResponse.content || []);
      setRooms(roomsResponse || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch show data");
      navigate("/admin/list-shows");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.movieId) {
      toast.error("Please select a movie");
      return false;
    }
    if (!formData.roomId) {
      toast.error("Please select a room");
      return false;
    }
    if (!formData.showDate) {
      toast.error("Please select a show date");
      return false;
    }
    if (!formData.showTime) {
      toast.error("Please select a show time");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return false;
    }

    // Validate: show time should not be in the past
    const showDateTime = new Date(`${formData.showDate}T${formData.showTime}`);
    if (showDateTime <= new Date()) {
      toast.error("Cannot set show time in the past");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateShow(showId, {
        ...formData,
        price: parseFloat(formData.price),
      });
      toast.success("Show updated successfully");
      navigate("/admin/list-shows");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update show");
    } finally {
      setLoading(false);
    }
  };

  const selectedMovie = movies.find(m => m.id === parseInt(formData.movieId));

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title text1="Edit" text2="Show" icon={FaClock} />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 border border-gray-200"
      >
        {/* Movie Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-900 rounded"></div>
            Movie Selection
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaFilm className="text-gray-500" />
                Movie *
              </label>
              <select
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-400 transition-all outline-none text-gray-900"
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title} ({movie.runtime || 120} min)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Room Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-600 rounded"></div>
            Room Selection
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaDoorOpen className="text-gray-500" />
                Room *
              </label>
              <select
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-400 transition-all outline-none text-gray-900"
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} {room.capacity ? `(Capacity: ${room.capacity})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Show Schedule */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-900 rounded"></div>
            Show Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendar className="text-gray-500" />
                Show Date *
              </label>
              <input
                type="date"
                name="showDate"
                value={formData.showDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-400 transition-all outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaClock className="text-gray-500" />
                Show Time *
              </label>
              <input
                type="time"
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-400 transition-all outline-none text-gray-900"
              />
            </div>
          </div>

          {/* Overlap Warning */}
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-600 text-xl mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">
                  Check for Overlaps
                </p>
                <p className="text-sm text-yellow-700">
                  Make sure this show time doesn't overlap with other shows in
                  the same room. The system will automatically check and prevent
                  overlapping schedules.
                </p>
                {selectedMovie && (
                  <p className="text-sm text-yellow-700 mt-2">
                    <strong>Movie runtime:</strong> {selectedMovie.runtime || 120} minutes
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-900 rounded"></div>
            Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Price ({currency}) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-400 transition-all outline-none text-gray-900"
                placeholder="9.99"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/admin/list-shows")}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 
                     font-medium hover:bg-gray-50 flex items-center gap-2 transition-all"
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium 
                     shadow-md hover:bg-gray-800 disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            <FaSave />
            {loading ? "Updating..." : "Update Show"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShows;
