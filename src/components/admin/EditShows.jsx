import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaClock, FaSave, FaTimes, FaFilm, FaCalendar } from "react-icons/fa";
import { getAllMoviesForAdmin } from "../../service/admin/MovieService";
import { updateShow } from "../../service/admin/ShowService";
import { getShowById } from "../../service/ShowService";

const EditShows = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    movieId: "",
    showDate: "",
    showTime: "",
    price: "",
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (showId) {
    }
  });
  useEffect(() => {
    fetchData();
  }, [showId]);

  const fetchData = async () => {
    try {
      const [showResponse, moviesResponse] = await Promise.all([
        getShowById(showId),
        getAllMoviesForAdmin(0, 1000, null),
      ]);

      const show = showResponse;
      setFormData({
        movieId: show.movieId || "",
        showDate: show.showDate || "",
        showTime: show.showTime || "",
        price: show.price || "",
      });
      setMovies(moviesResponse.content || []);
    } catch (error) {
      toast.error("Failed to fetch show data");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateShow(showId, formData);
      toast.success("Show updated successfully");
      navigate("/admin/list-shows");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update show");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title text1="Edit" text2="Show" icon={FaClock} />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        {/* Movie Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Movie Selection
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaFilm className="text-purple-500" />
                Movie *
              </label>
              <select
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Show Schedule */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Show Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaCalendar className="text-purple-500" />
                Show Date *
              </label>
              <input
                type="date"
                name="showDate"
                value={formData.showDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaClock className="text-purple-500" />
                Show Time *
              </label>
              <input
                type="time"
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ticket Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="9.99"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/list-shows")}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700
                     flex items-center gap-2 transition-all"
          >
            <FaTimes /> Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white font-medium shadow-lg hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2 transition-all"
          >
            <FaSave />
            {loading ? "Updating..." : "Update Show"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default EditShows;
