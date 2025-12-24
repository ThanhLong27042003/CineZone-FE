import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShows,
  setShowsLoading,
  setShowsError,
} from "../../redux/reducer/AdminReducer";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { getAllMoviesForAdmin } from "../../service/admin/MovieService";
import {
  deleteShow,
  getAllShowsForAdmin,
} from "../../service/admin/ShowService";
import { motion } from "framer-motion";
import {
  FaFilm,
  FaClock,
  FaTicketAlt,
  FaDollarSign,
  FaSearch,
  FaCalendar,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const ListShows = () => {
  const dispatch = useDispatch();
  const adminState = useSelector((state) => state.admin || {});
  const {
    data: shows = [],
    loading = false,
    currentPage = 0,
    totalPages = 0,
  } = adminState.shows || {};

  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    movieId: "",
    date: "",
  });
  const [movies, setMovies] = useState([]);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchShows();
  }, [page, debouncedFilters]);

  const fetchMovies = async () => {
    try {
      const response = await getAllMoviesForAdmin(0, 1000, null);
      setMovies(response.content || []);
    } catch (error) {
      toast.error("Failed to fetch movies");
    }
  };

  const fetchShows = async () => {
    try {
      dispatch(setShowsLoading(true));
      const response = await getAllShowsForAdmin(
        page,
        10,
        debouncedFilters.movieId || null,
        debouncedFilters.date || null
      );
      dispatch(setShows(response || []));
    } catch (error) {
      dispatch(setShowsError(error.message));
      toast.error("Failed to fetch shows");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0);
  };

  const handleDelete = async (showId) => {
    if (window.confirm("Are you sure you want to delete this show?")) {
      try {
        await deleteShow(showId);
        toast.success("Show deleted successfully");
        fetchShows();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete show");
      }
    }
  };

  const resetFilters = () => {
    setFilters({
      movieId: "",
      date: "",
    });
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <Title text1="List" text2="Shows" icon={FaFilm} />

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FaFilm className="text-purple-500" />
              Filter by Movie
            </label>
            <select
              name="movieId"
              value={filters.movieId}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                       border-2 border-gray-200 dark:border-gray-600 
                       focus:border-purple-500 transition-all outline-none
                       text-gray-900 dark:text-white"
            >
              <option value="">All Movies</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FaCalendar className="text-purple-500" />
              Filter by Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                       border-2 border-gray-200 dark:border-gray-600 
                       focus:border-purple-500 transition-all outline-none
                       text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-end space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-all"
            >
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                       px-6 py-3 rounded-xl hover:shadow-xl transition-all font-medium
                       flex items-center justify-center gap-2"
              onClick={() => (window.location.href = "/admin/add-shows")}
            >
              <FaPlus /> Add New Show
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            label: "Total Shows",
            value: shows.length,
            icon: FaFilm,
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Total Revenue",
            value: `$${shows
              .reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0)
              .toFixed(2)}`,
            icon: FaDollarSign,
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Avg Price",
            value:
              shows.length > 0
                ? `$${(
                    shows.reduce(
                      (acc, s) => acc + (parseFloat(s.price) || 0),
                      0
                    ) / shows.length
                  ).toFixed(2)}`
                : "$0.00",
            icon: FaTicketAlt,
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "Today's Shows",
            value: shows.filter((s) => {
              const today = new Date().toISOString().split("T")[0];
              return s.showDate === today;
            }).length,
            icon: FaClock,
            color: "from-orange-500 to-red-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
              >
                <stat.icon
                  className={`text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Shows Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : shows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Movie</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Show Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Show Time
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show, index) => (
                  <motion.tr
                    key={show.showId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700
                             hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500
                                    flex items-center justify-center text-white font-bold text-xl"
                        >
                          <FaFilm />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Movie ID: {show.movieId}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Show #{show.showId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaCalendar className="text-purple-500" />
                        <span>{formatDate(show.showDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaClock className="text-purple-500" />
                        <span>{formatTime(show.showTime)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30
                                     text-green-700 dark:text-green-300 font-bold text-sm"
                      >
                        ${parseFloat(show.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            (window.location.href = `/admin/edit-show/${show.showId}`)
                          }
                          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600
                                   flex items-center justify-center"
                          title="Edit"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(show.showId)}
                          className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600
                                   flex items-center justify-center"
                          title="Delete"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaFilm className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No shows found
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-3 mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-purple-500 transition-all shadow-lg"
          >
            Previous
          </motion.button>

          <div
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
                        text-white font-bold shadow-lg"
          >
            Page {page + 1} of {totalPages}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-purple-500 transition-all shadow-lg"
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ListShows;
