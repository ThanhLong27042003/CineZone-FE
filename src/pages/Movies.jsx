import React, { useState, useEffect } from "react";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import FilterSection from "../components/FilterSection";
import { FilterIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getMovieForPageApi } from "../redux/reducer/FilmReducer";
import Loading from "../components/Loading";
import { motion } from "framer-motion";

const Movies = () => {
  const { filmForPage, loading } = useSelector((state) => state.FilmReducer);
  const dispatch = useDispatch();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});

  // ← Pagination state - Backend page từ 0
  const [currentPage, setCurrentPage] = useState(0);
  const moviesPerPage = 20;

  // ← Fetch movies khi page thay đổi
  useEffect(() => {
    console.log("🔄 Fetching page:", currentPage);
    dispatch(getMovieForPageApi({ page: currentPage, size: moviesPerPage }));
  }, [currentPage, dispatch]);

  // ← Scroll to top khi đổi page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ← Update filtered movies khi data thay đổi
  useEffect(() => {
    console.log("📊 filmForPage updated:", filmForPage);
    if (filmForPage?.content) {
      setFilteredMovies(filmForPage.content);
    }
  }, [filmForPage]);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    let filtered = [...(filmForPage?.content || [])];

    if (filters.genre && filters.genre !== "All") {
      filtered = filtered.filter((movie) =>
        movie.genres?.some((genre) => genre.name === filters.genre)
      );
    }

    if (filters.country && filters.country !== "All") {
      filtered = filtered.filter((movie) =>
        movie.genres?.some((genre) => genre.name === filters.country)
      );
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "IMDb Rating":
          filtered.sort((a, b) => b.voteAverage - a.voteAverage);
          break;
        case "Latest":
          filtered.sort(
            (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
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

  // ← Pagination handlers
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

  // ← Generate page numbers
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

  if (loading) return <Loading />;

  return (
    <div className="relative my-40 mb-20 px-6 md:px-16 lg:px-35 xl:px-40 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" left="50px" />

      {/* Header */}
      <div className="flex items-center justify-between my-4">
        <div>
          <h1 className="text-lg font-medium my-4">
            {Object.values(currentFilters).some(
              (filter) => filter !== "All" && filter !== "Latest"
            )
              ? "Filter results"
              : "Now Showing"}
          </h1>
          <p className="text-gray-400 text-sm">
            Showing {currentPage * moviesPerPage + 1}-
            {Math.min(
              (currentPage + 1) * moviesPerPage,
              filmForPage?.totalElements || 0
            )}{" "}
            of {filmForPage?.totalElements || 0} movies
          </p>
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg hover:bg-primary/30 transition text-white cursor-pointer"
        >
          <FilterIcon className="w-4 h-4" />
          Bộ lọc
        </button>
      </div>

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
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-lg">No movies found</p>
        </div>
      )}

      {/* Pagination Controls */}
      {filmForPage?.totalPages > 1 && (
        <motion.div
          className="flex items-center justify-center gap-2 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Previous Button */}
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

          {/* Page Numbers */}
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
                    {page + 1} {/* ← Hiển thị page + 1 cho user */}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
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

      {/* Page Info Mobile */}
      {filmForPage?.totalPages > 1 && (
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
