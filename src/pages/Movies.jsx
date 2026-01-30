import React, { useState, useEffect } from "react";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import FilterSection from "../components/FilterSection";
import DateFilter from "../components/DateFilter";
import { Filter, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getAllMovieApi, getMovieForPageApi } from "../redux/reducer/FilmReducer";
import { getAvailableDates, getShowsByDate } from "../service/ShowService";
import Loading from "../components/Loading";
import { motion } from "framer-motion";
import { laythongtinphim } from "../service/MovieService";

const Movies = () => {
  const { arrFilm, loading } = useSelector((state) => state.FilmReducer);
  const dispatch = useDispatch();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const [activeTab, setActiveTab] = useState("NOW_SHOWING");

  // ✨ NEW: Date filter state
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);

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

  // Fetch all movies on mount
  useEffect(() => {
    dispatch(getAllMovieApi());
  }, [dispatch]);

  // ✨ Fetch shows by date when date is selected
  useEffect(() => {
    const loadShowsByDate = async () => {
      if (selectedDate) {
        try {
          setIsLoadingDates(true);
          const shows = await getShowsByDate(selectedDate);

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
            if (movie && movie.status !== 'STOPPED') {
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


  // ✨ Re-apply filters when activeTab or arrFilm changes
  useEffect(() => {
    if (!selectedDate && arrFilm) {
      let filtered = [...arrFilm];

      // Filter by Tab (Status)
      filtered = filtered.filter((movie) => movie.status === activeTab);

      // Filter by Genre
      if (currentFilters.genre && currentFilters.genre !== "All") {
        filtered = filtered.filter((movie) =>
          movie.genres?.some((genre) => genre.name === currentFilters.genre),
        );
      }

      // Sort
      if (currentFilters.sortBy) {
        switch (currentFilters.sortBy) {
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
    }
  }, [arrFilm, activeTab, currentFilters, selectedDate]);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    // Logic moved to useEffect
  };

  // ✨ Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  if (loading || isLoadingDates) return <Loading />;

  return (
    <div className="relative my-40 mb-20 px-6 md:px-16 lg:px-35 xl:px-40 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" left="50px" />

      {/* Header */}
      <div className="flex items-center justify-between my-4 flex-wrap gap-4">
        <div>
          {/* Tabs */}
          <div className="flex gap-6 mb-2">
            <button
              onClick={() => {
                setActiveTab("NOW_SHOWING");
              }}
              className={`text-xl font-bold pb-1 transition-all border-b-2 ${
                activeTab === "NOW_SHOWING"
                  ? "text-white border-primary"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => {
                setActiveTab("COMING_SOON");
              }}
              className={`text-xl font-bold pb-1 transition-all border-b-2 ${
                activeTab === "COMING_SOON"
                  ? "text-white border-primary"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              Coming Soon
            </button>
          </div>

          <p className="text-gray-400 text-sm">
            {selectedDate
              ? `Tìm thấy ${filteredMovies.length} phim`
              : `Found ${filteredMovies.length} movies`}
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
        (currentFilters.genre && currentFilters.genre !== "All")) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-gray-400">Filters:</span>

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

  // No pagination controls needed



      <FilterSection
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default Movies;
