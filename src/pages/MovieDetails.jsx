import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllMovieApi,
  getMovieByIdApi,
  isLikedApi,
} from "../redux/reducer/FilmReducer";
import { getAllShowByMovieIdApi } from "../redux/reducer/ShowReducer";
import {
  Heart,
  StarIcon,
  YoutubeIcon,
  Play,
  Clock,
  Calendar,
  X, // ← NEW: Import X icon for close button
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import timeFormat from "../../utils/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import {
  addFavoriteMovieApi,
  removeFavoriteMovieApi,
} from "../redux/reducer/ProfileReducer";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  getRecommendationsApi,
  clearRecommendations,
} from "../redux/reducer/GeneralReducer";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { film, arrFilm, checkLiked } = useSelector(
    (state) => state.FilmReducer
  );
  const { arrShow } = useSelector((state) => state.ShowReducer);
  const { recommendations, recommendationsLoading } = useSelector(
    (state) => state.GeneralReducer
  );
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(checkLiked);
  const [showTrailer, setShowTrailer] = useState(false);
  const { myInfo } = useAuth();
  const handleLikeMovieClick = (isLike) => {
    if (!myInfo) {
      navigate("/login");
      return;
    }
    setIsLiked((prev) => !prev);
    if (isLike) {
      const res = dispatch(
        addFavoriteMovieApi({ userId: myInfo?.id, movieId: id })
      ).then((res) => res.payload);
      toast.success(res);
    } else {
      const res = dispatch(
        removeFavoriteMovieApi({ userId: myInfo?.id, movieId: id })
      ).then((res) => res.payload);
      toast.success(res);
    }
  };
  useEffect(() => {
    if (id) {
      dispatch(getMovieByIdApi(id));
      dispatch(getAllShowByMovieIdApi(id));
      dispatch(getAllMovieApi());
      dispatch(isLikedApi({ userId: myInfo?.id, movieId: id }));
      // ✅ THÊM: Lấy AI recommendations
      dispatch(getRecommendationsApi({ movieId: id, limit: 4 }));
    }
    // Cleanup khi unmount
    return () => {
      dispatch(clearRecommendations());
    };
  }, [dispatch, id]);

  useEffect(() => {
    setIsLiked(checkLiked);
  }, [checkLiked]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowTrailer(false);
      }
    };
    if (showTrailer) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showTrailer]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  };

  return film ? (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(9,9,11,0.9), rgb(9,9,11)), url(${film?.backdropPath?.replace(
            "upload/",
            "upload/h_869,w_1526/"
          )})`,
        }}
      >
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-32 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Movie Poster */}
              <motion.div className="lg:col-span-2" {...fadeInLeft}>
                <div className="relative group">
                  <img
                    src={film.posterPath}
                    alt={film.title}
                    className="w-full max-w-md mx-auto lg:mx-0 rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* ← MODIFIED: Only show play button if trailer exists */}
                  {film.trailer && (
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowTrailer(true)}
                        className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30"
                      >
                        <Play className="w-8 h-8 text-white" fill="white" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Movie Info */}
              <motion.div className="lg:col-span-3 space-y-6" {...fadeInRight}>
                <div className="relative">
                  <BlurCircle top="-100px" right="-100px" />

                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    ENGLISH
                  </div>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {film.title}
                  </motion.h1>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">
                        {film.voteAverage.toFixed(1)}
                      </span>
                      <span className="text-gray-400">User Rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{timeFormat(film.runtime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{film.releaseDate?.split("-")[0] || ""}</span>
                    </div>
                  </div>

                  <motion.p
                    className="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {film.overview}
                  </motion.p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {film.genres.map((genre, index) => (
                      <motion.span
                        key={genre.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                        className="px-3 py-1 bg-gray-800/60 border border-gray-700 rounded-full text-gray-300 text-sm backdrop-blur-sm"
                      >
                        {genre.name}
                      </motion.span>
                    ))}
                  </div>

                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    {/* ← MODIFIED: Only show Watch Trailer button if trailer exists */}
                    {film.trailer && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowTrailer(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm"
                      >
                        <YoutubeIcon className="w-5 h-5" />
                        Watch Trailer
                      </motion.button>
                    )}

                    <motion.a
                      href="#dateSelect"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-primary/25"
                    >
                      Buy Tickets
                    </motion.a>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLikeMovieClick(!isLiked)}
                      className="p-3 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700 rounded-xl transition-all duration-300 backdrop-blur-sm"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isLiked
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-2xl font-bold text-white mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Your Favorite Cast
          </motion.h2>

          <div className="overflow-y-hidden pb-4">
            <motion.div
              className="flex gap-6 w-max"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {film.casts.slice(0, 12).map((cast, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center text-center group cursor-pointer min-w-[120px]"
                >
                  <div className="relative">
                    <img
                      src={cast.profilePath}
                      alt={cast.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-700 group-hover:border-primary transition-colors duration-300"
                    />
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <p className="font-medium text-sm mt-3 text-white group-hover:text-primary transition-colors duration-300">
                    {cast.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Date Selection */}

      <div className="mx-40" id="dateSelect">
        {Object.entries(
          arrShow.reduce((acc, show) => {
            const date = show.showDate;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(show);
            return acc;
          }, {})
        ).map(([showDate, showsForDate]) => (
          <DateSelect
            key={showDate}
            showDate={showDate}
            showsForDate={showsForDate}
            id={showsForDate[0].movieId}
          />
        ))}
      </div>

      {/* Recommendations Section */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-2xl font-bold text-white mb-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            You May Also Like
            {/* ✅ Optional: Hiển thị badge AI */}
            <span className="ml-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
              AI Powered
            </span>
          </motion.h2>

          {recommendationsLoading ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* ✅ SỬA: Dùng recommendations thay vì arrFilm */}
              {(recommendations.length > 0
                ? recommendations
                : arrFilm.slice(0, 4)
              ).map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/movies");
                scrollTo(0, 0);
              }}
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              Show More Movies
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ✨ NEW: Trailer Modal ✨ */}
      <AnimatePresence>
        {showTrailer && film.trailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl mx-4 md:mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <X className="w-6 h-6 text-white" />
              </motion.button>

              {/* Video Container */}
              <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <iframe
                  src={`${film.trailer}?autoplay=1`}
                  title={`${film.title} Trailer`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Movie Info Below Video */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-4 text-center"
              >
                <h3 className="text-white text-xl font-semibold mb-1">
                  {film.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  Press ESC to close or click outside
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDetails;
