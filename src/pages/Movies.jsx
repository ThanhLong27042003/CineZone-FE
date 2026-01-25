import React, { useState, useEffect } from "react";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import FilterSection from "../components/FilterSection";
import DateFilter from "../components/DateFilter";
import { Filter, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getMovieForPageApi } from "../redux/reducer/FilmReducer";
import { getAvailableDates, getShowsByDate } from "../service/ShowService";
import Loading from "../components/Loading";
import { motion } from "framer-motion";
import { laythongtinphim } from "../service/MovieService";

const Movies = () => {
  const { filmForPage, loading } = useSelector((state) => state.FilmReducer);
  const dispatch = useDispatch();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});

  // ✨ NEW: Date filter state
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [showsByDate, setShowsByDate] = useState(null);
  const [isLoadingDates, setIsLoadingDates] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const moviesPerPage = 20;

  // ✨ Load available dates on mount
  useEffect(() => {
    const loadAvailableDates = async () => {
      try {
        setIsLoadingDates(true);
        const dates = await getAvailableDates();
        setAvailableDates(dates);
      } catch (error) {
        console.error("Failed to load available dates:", error);
      } finally {
        setIsLoadingDates(false);
      }
    };

    loadAvailableDates();
  }, []);

  // Fetch movies when page changes (if no date filter)
  useEffect(() => {
    if (!selectedDate) {
      dispatch(getMovieForPageApi({ page: currentPage, size: moviesPerPage }));
    }
  }, [currentPage, dispatch, selectedDate]);

  // ✨ Fetch shows by date when date is selected
  useEffect(() => {
    const loadShowsByDate = async () => {
      if (selectedDate) {
        try {
          setIsLoadingDates(true);
          const shows = await getShowsByDate(selectedDate);
          setShowsByDate(shows);

          // Extract unique movies from shows
          const movieIds = new Set();
          const moviesWithShows = [];

          Object.values(shows)
            .flat()
            .forEach((show) => {
              if (!movieIds.has(show.movieId)) {
                movieIds.add(show.movieId);
              }
            });

          for (const id of movieIds) {
            const movie = await laythongtinphim(id);
            console.log("movie", movie);
            if (movie) {
              moviesWithShows.push(movie);
            }
          }

          setFilteredMovies(moviesWithShows);
        } catch (error) {
          console.error("Failed to load shows by date:", error);
        } finally {
          setIsLoadingDates(false);
        }
      }
    };

    loadShowsByDate();
  }, [selectedDate]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Update filtered movies when data changes
  useEffect(() => {
    if (!selectedDate && filmForPage?.content) {
      setFilteredMovies(filmForPage.content);
    }
  }, [filmForPage, selectedDate]);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    let filtered = [...(filmForPage?.content || [])];

    if (filters.genre && filters.genre !== "All") {
      filtered = filtered.filter((movie) =>
        movie.genres?.some((genre) => genre.name === filters.genre),
      );
    }

    if (filters.country && filters.country !== "All") {
      filtered = filtered.filter((movie) =>
        movie.genres?.some((genre) => genre.name === filters.country),
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "IMDb Rating":
          filtered.sort((a, b) => b.voteAverage - a.voteAverage);
          break;
        case "Latest":
          filtered.sort(
            (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate),
          );
          break;
        case "Vote Count":
          filtered.sort((a, b) => b.popularity - a.popularity);
          break;
        default:
          break;
      }
    }

    setFilteredMovies(filtered);
  };

  // ✨ Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentPage(0);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (filmForPage?.totalPages && currentPage < filmForPage.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalPages = filmForPage?.totalPages || 0;
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 0; i < 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push("...");
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  if (loading || isLoadingDates) return <Loading />;

  return (
    <div className="relative my-40 mb-20 px-6 md:px-16 lg:px-35 xl:px-40 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" left="50px" />

      {/* Header */}
      <div className="flex items-center justify-between my-4 flex-wrap gap-4">
        <div>
          <h1 className="text-lg font-medium my-4">
            {selectedDate ? (
              <>
                Suất chiếu ngày{" "}
                <span className="text-primary">
                  {new Date(selectedDate).toLocaleDateString("vi-VN")}
                </span>
              </>
            ) : Object.values(currentFilters).some(
                (filter) => filter !== "All" && filter !== "Latest",
              ) ? (
              "Filter results"
            ) : (
              "Now Showing"
            )}
          </h1>
          <p className="text-gray-400 text-sm">
            {selectedDate ? (
              `Tìm thấy ${filteredMovies.length} phim`
            ) : (
              <>
                Showing {currentPage * moviesPerPage + 1}-
                {Math.min(
                  (currentPage + 1) * moviesPerPage,
                  filmForPage?.totalElements || 0,
                )}{" "}
                of {filmForPage?.totalElements || 0} movies
              </>
            )}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <DateFilter
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            availableDates={availableDates}
          />

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg hover:bg-primary/30 transition text-white cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedDate ||
        Object.values(currentFilters).some(
          (f) => f !== "All" && f !== "Latest",
        )) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-gray-400">Đang lọc:</span>

          {selectedDate && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-sm">
              <Calendar className="w-3 h-3" />
              {new Date(selectedDate).toLocaleDateString("vi-VN")}
              <button
                onClick={() => handleDateSelect(null)}
                className="ml-1 hover:text-primary"
              >
                ×
              </button>
            </div>
          )}

          {currentFilters.genre && currentFilters.genre !== "All" && (
            <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-sm">
              {currentFilters.genre}
            </div>
          )}
        </div>
      )}

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <motion.div
          className="flex flex-wrap max-sm:justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Calendar className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">
            {selectedDate
              ? "Không có suất chiếu nào vào ngày này"
              : "No movies found"}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {!selectedDate && filmForPage?.totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center gap-2 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              currentPage === 0
                ? "bg-zinc-800/50 text-gray-600 cursor-not-allowed"
                : "bg-zinc-800 text-white hover:bg-zinc-700 hover:shadow-lg"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 min-w-[44px] ${
                      currentPage === page
                        ? "bg-gradient-to-r from-primary to-primary-dull text-white shadow-lg shadow-primary/25"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    {page + 1}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === filmForPage?.totalPages - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              currentPage === filmForPage?.totalPages - 1
                ? "bg-zinc-800/50 text-gray-600 cursor-not-allowed"
                : "bg-zinc-800 text-white hover:bg-zinc-700 hover:shadow-lg"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {!selectedDate && filmForPage?.totalPages > 1 && (
        <div className="flex justify-center mt-4 sm:hidden">
          <span className="text-gray-400 text-sm">
            Page {currentPage + 1} of {filmForPage?.totalPages}
          </span>
        </div>
      )}

      <FilterSection
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default Movies;
