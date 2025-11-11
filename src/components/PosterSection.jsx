import React, { useState, useEffect } from "react";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../../utils/timeFormat";
import { useSelector } from "react-redux";

const PosterSection = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const movieList = useSelector(
    (state) => state.FilmReducer.filmsByGenre || []
  );
  useEffect(() => {
    if (movieList?.[0]?.length > 0) {
      setMovie(movieList[0][0]);
    }
  }, [movieList]);

  const handlePosterClick = (movieClick) => {
    if (movieClick.backdropPath === movie.backdropPath) return;

    setIsAnimating(true);
    setTimeout(() => {
      setMovie(movieClick);
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const currentIndex = movieList.findIndex(
        (p) => p[0].backdropPath == movie.backdropPath
      );
      const nextIndex = (currentIndex + 1) % posters.length;
      handlePosterClick(movieList[nextIndex][0]);
    }, 10000);

    return () => clearInterval(timer);
  }, [movie]);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute flex inset-0">
        <div className="relative inset-y-0 left-0 w-full">
          <div className="absolute inset-y-0 left-0 w-[calc(100%+300px)] bg-gradient-to-r from-[#09090b]/100 via-[#09090b]/60 to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-[calc(100%+300px)] bg-gradient-to-r from-[#09090b]/100 via-[#09090b]/60 to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-[calc(100%+300px)] bg-gradient-to-r from-[#09090b]/100 via-[#09090b]/60 to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-[calc(100%+300px)] bg-gradient-to-r from-[#09090b]/100 via-[#09090b]/60 to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-[calc(100%+300px)] bg-gradient-to-r from-[#09090b]/100 via-[#09090b]/60 to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-[calc(100%+300px)] bg-gradient-to-r from-[#09090b]/100 via-[#09090b]/60 to-transparent z-10" />
        </div>

        <img
          src={movie?.backdropPath?.replace("upload/", "upload/h_869,w_1526/")}
          alt={movie?.title}
          loading="lazy"
          className={`w-auto h-full transition-all duration-500 transform ${
            isAnimating ? "opacity-0 translate-x-10" : ""
          }
  `}
        />
      </div>
      <div className="absolute right-10 bottom-20 group grid grid-cols-5 gap-4 md:gap-8 max-w-xl z-20">
        {movieList.map((poster) => (
          <div
            key={poster[0].backdropPath}
            className="group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer"
            onClick={() => handlePosterClick(poster[0])}
          >
            <img
              src={poster[0].backdropPath.replace(
                "upload/",
                "upload/h_196,w_291/"
              )}
              alt={poster[0].title}
              loading="lazy"
              className="rounded-lg w-full h-full object-cover brightness-80"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090B]/80" />
      <div className="absolute left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent" />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-16 h-full text-white transition-all duration-500 transform ${
          isAnimating ? "opacity-0 -translate-x-10" : ""
        }`}
      >
        <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
          {movie?.title}
        </h1>

        <div className=" text-gray-300 space-y-2">
          <div>
            {" "}
            <span>
              {movie?.genres
                ?.reduce((acc, curr) => {
                  acc.push(curr.name);
                  return acc;
                }, [])
                .join(" | ")}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4.5 h-4.5" />
            {movie?.releaseDate}
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4.5 h-4.5" />
            {timeFormat(movie?.runtime)}
          </div>
        </div>

        <p className="max-w-md text-gray-300">{movie?.overview}</p>

        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Explore Movies
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PosterSection;
