import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMovies,
  setMoviesLoading,
  setMoviesError,
} from "../../redux/reducer/AdminReducer";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import {
  deleteMovie,
  getAllMoviesForAdmin,
} from "../../service/admin/MovieService";
import {
  FaFilm,
  FaStar,
  FaClock,
  FaCalendar,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const ListMovies = () => {
  const dispatch = useDispatch();
  const {
    data: movies,
    loading,
    currentPage,
    totalPages,
  } = useSelector((state) => state.admin.movies);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchMovies();
  }, [page, debouncedSearchTerm]);

  const fetchMovies = async () => {
    try {
      dispatch(setMoviesLoading(true));
      const response = await getAllMoviesForAdmin(
        page,
        10,
        debouncedSearchTerm || null
      );
      dispatch(setMovies(response));
    } catch (error) {
      dispatch(setMoviesError(error.message));
      toast.error("Failed to fetch movies");
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie? This action cannot be undone.")) {
      try {
        await deleteMovie(movieId);
        toast.success("Movie deleted successfully");
        fetchMovies();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete movie. It may have associated shows or bookings.");
      }
    }
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

  return (
    <div className="space-y-6">
      <Title text1="List" text2="Movies" icon={FaFilm} />

      {/* Search and Add Button Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white
                     border-2 border-gray-200 focus:border-gray-400 
                     transition-all outline-none shadow-md text-gray-900"
          />
          {searchTerm !== debouncedSearchTerm && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <button
          onClick={() => (window.location.href = "/admin/create-movie")}
          className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium 
                   shadow-md hover:bg-gray-800 transition-all flex items-center 
                   gap-2 justify-center whitespace-nowrap"
        >
          <FaPlus /> Add New Movie
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Movies",
            value: movies?.length || 0,
            icon: FaFilm,
          },
          {
            label: "Total Runtime",
            value: `${movies?.reduce((acc, m) => acc + (m.runtime || 0), 0) || 0} min`,
            icon: FaClock,
          },
          {
            label: "Avg Rating",
            value:
              movies && movies.length > 0
                ? (
                    movies.reduce((acc, m) => acc + (m.voteAverage || 0), 0) /
                    movies.length
                  ).toFixed(1)
                : "0.0",
            icon: FaStar,
          },
          {
            label: "Total Votes",
            value: movies?.reduce((acc, m) => acc + (m.voteCount || 0), 0) || 0,
            icon: FaCalendar,
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

      {/* Movies Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Movie Details</th>
                  <th className="px-6 py-4 text-left font-semibold">Release Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Duration</th>
                  <th className="px-6 py-4 text-left font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left font-semibold">Genres</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr
                    key={movie.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={movie.posterPath || "/placeholder.jpg"}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {movie.overview || "No description available"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendar className="text-gray-500" />
                        <span>{formatDate(movie.releaseDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-gray-500" />
                        <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        <span className="font-bold text-gray-900">
                          {movie.voteAverage ? movie.voteAverage.toFixed(1) : "N/A"}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({movie.voteCount || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {movie.genres && movie.genres.length > 0 ? (
                          movie.genres.slice(0, 2).map((genre) => (
                            <span
                              key={genre.id}
                              className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium text-xs"
                            >
                              {genre.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No genres</span>
                        )}
                        {movie.genres && movie.genres.length > 2 && (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                            +{movie.genres.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/admin/edit-movie/${movie.id}`)
                          }
                          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
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
            <p className="text-gray-500 text-lg">No movies found</p>
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

export default ListMovies;
