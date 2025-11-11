import React, { useState, useEffect } from "react";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import FilterSection from "../components/FilterSection";
import { FilterIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getAllMovieApi } from "../redux/reducer/FilmReducer";
import Loading from "../components/Loading";

const Movies = () => {
  const { arrFilm } = useSelector((state) => state.FilmReducer);
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    let filtered = [...arrFilm];

    if (filters.genre && filters.genre !== "All") {
      filtered = filtered.filter((movie) =>
        movie.genres.some((genre) => genre.name === filters.genre)
      );
    }

    if (filters.country && filters.country !== "All") {
      filtered = filtered.filter((movie) =>
        movie.genres.some((genre) => genre.name === filters.country)
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

  useEffect(() => {
    dispatch(getAllMovieApi());
  }, [dispatch]);

  useEffect(() => {
    setFilteredMovies(arrFilm);
  }, [arrFilm]);

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-35 xl:px-40 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" left="50px" />
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
            {filteredMovies.length} movies matched your filters
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
      {filteredMovies.length > 0 ? (
        <div className="flex flex-wrap max-sm:justify-center gap-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <Loading />
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
