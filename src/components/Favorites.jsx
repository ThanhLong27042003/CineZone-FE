import React from "react";
import { Heart } from "lucide-react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";

const Favorites = ({ favoriteFilms, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (favoriteFilms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Heart className="w-20 h-20 text-gray-600 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          No Favorite Movies Yet
        </h3>
        <p className="text-gray-400 text-center max-w-md">
          Start adding movies to your favorites by clicking the heart icon on
          any movie card.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" left="50px" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Favorite Movies</h2>
        <p className="text-gray-400">{favoriteFilms.length} movies</p>
      </div>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {favoriteFilms.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              movieid: movie.id,
              title: movie.title,
              overview: movie.overview,
              releaseDate: movie.releaseDate,
              runtime: movie.runtime,
              posterPath: movie.posterPath,
              backdropPath: movie.backdropPath,
              voteAverage: movie.voteAverage,
              voteCount: movie.voteCount,
              trailer: movie.trailer,
              genres: movie.genres,
              casts: movie.casts,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
