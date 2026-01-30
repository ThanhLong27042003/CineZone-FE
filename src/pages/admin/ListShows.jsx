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
  getAllShowsForAdmin,
} from "../../service/admin/ShowService";
import {
  FaFilm,
  FaClock,
  FaTicketAlt,
  FaCalendar,
  FaEdit,
  FaPlus,
  FaDoorOpen,
} from "react-icons/fa";

const ListShows = () => {
  const dispatch = useDispatch();
  const currency = import.meta.env.VITE_CURRENCY || "$";
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
    startDate: "",
    endDate: "",
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

      let start = null;
      let end = null;
      if (debouncedFilters.startDate) {
        start = debouncedFilters.startDate + "T00:00:00";
      }
      if (debouncedFilters.endDate) {
        end = debouncedFilters.endDate + "T23:59:59";
      }

      const response = await getAllShowsForAdmin(
        page,
        10,
        debouncedFilters.movieId || null,
        start,
        end
      );

      dispatch(setShows(response || { content: [], totalPages: 0, number: 0 }));
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



  const resetFilters = () => {
    setFilters({
      movieId: "",
      startDate: "",
      endDate: "",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-700 border border-green-300";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "FINISHED":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "OPEN":
        return "🟢 Open";
      case "DRAFT":
        return "📝 Draft";
      case "FINISHED":
        return "✅ Finished";
      default:
        return status || "N/A";
    }
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find((m) => m.id === movieId);
    return movie ? movie.title : `Movie #${movieId}`;
  };

  return (
    <div className="space-y-6">
      <Title text1="List" text2="Shows" icon={FaFilm} />

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaFilm className="text-gray-500" />
              Filter by Movie
            </label>
            <select
              name="movieId"
              value={filters.movieId}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                       focus:border-gray-400 transition-all outline-none text-gray-900"
            >
              <option value="">All Movies</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendar className="text-gray-500" />
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate || ""}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                       focus:border-gray-400 transition-all outline-none text-gray-900"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendar className="text-gray-500" />
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate || ""}
              onChange={handleFilterChange}
              min={filters.startDate}
              className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                       focus:border-gray-400 transition-all outline-none text-gray-900"
            />
          </div>

          <div className="col-span-1 flex items-end space-x-2">
            <button
              onClick={resetFilters}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 
                       font-medium hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
            <button
              className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg 
                       hover:bg-gray-800 transition-all font-medium flex items-center 
                       justify-center gap-2"
              onClick={() => (window.location.href = "/admin/add-shows")}
            >
              <FaPlus /> Add New Show
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Shows",
            value: shows.length,
            icon: FaFilm,
          },
          {
            label: "Coming Soon",
            value: shows.filter((s) => s.status === "COMING_SOON").length,
            icon: FaCalendar,
          },
          {
            label: "Now Showing",
            value: shows.filter((s) => s.status === "NOW_SHOWING").length,
            icon: FaClock,
          },
          {
            label: "Finished",
            value: shows.filter((s) => s.status === "FINISHED").length,
            icon: FaTicketAlt,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-4 shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <stat.icon className="text-2xl text-gray-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shows Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : shows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Movie</th>
                  <th className="px-6 py-4 text-left font-semibold">Room</th>
                  <th className="px-6 py-4 text-left font-semibold">Show Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Show Time</th>
                  <th className="px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr
                    key={show.showId}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                          <FaFilm />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {getMovieTitle(show.movieId)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Show #{show.showId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaDoorOpen className="text-gray-500" />
                        <span>{show.roomName || `Room #${show.roomId}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendar className="text-gray-500" />
                        <span>{formatDate(show.showDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-gray-500" />
                        <span>{formatTime(show.showTime)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                        {currency}
                        {parseFloat(show.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(show.status)}`}
                      >
                        {getStatusLabel(show.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {show.status !== "FINISHED" ? (
                          <>
                            <button
                              onClick={() =>
                                (window.location.href = `/admin/edit-show/${show.showId}`)
                              }
                              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 italic px-2">
                            View Only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaFilm className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No shows found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters or add a new show
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 rounded-lg bg-white border-2 border-gray-200
                     text-gray-700 font-medium disabled:opacity-50 
                     disabled:cursor-not-allowed hover:border-gray-400 
                     transition-all shadow-md"
          >
            Previous
          </button>

          <div className="px-6 py-3 rounded-lg bg-gray-900 text-white font-bold shadow-md">
            Page {page + 1} of {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-6 py-3 rounded-lg bg-white border-2 border-gray-200
                     text-gray-700 font-medium disabled:opacity-50 
                     disabled:cursor-not-allowed hover:border-gray-400 
                     transition-all shadow-md"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ListShows;
