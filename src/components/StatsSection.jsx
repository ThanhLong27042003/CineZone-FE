import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAllStatsApi } from "../redux/reducer/StatsReducer";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Calendar,
  Receipt,
  Clock,
  MapPin,
  Film,
} from "lucide-react";

const StatsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cinemaStats, trendingMovies, comingSoonMovies, cinemaInfo, loading } =
    useSelector((state) => state.StatsReducer);

  useEffect(() => {
    dispatch(getAllStatsApi());
  }, [dispatch]);

  // Build stats array from API data
  const stats = cinemaStats
    ? [
        {
          icon: Film,
          label: "Now Showing",
          value: cinemaStats.nowShowing?.toString() || "0",
          change: "+3 new films",
          color: "from-purple-500 to-pink-500",
        },
        {
          icon: Receipt,
          label: "Total Bookings",
          value: cinemaStats.totalBooking ? `${cinemaStats.totalBooking}` : "0",
          change: "This month",
          color: "from-blue-500 to-cyan-500",
        },
        {
          icon: Star,
          label: "Rating",
          value: cinemaStats.averageRating
            ? `${cinemaStats.averageRating}/10`
            : "0/10",
          change: `${cinemaStats.totalReviews || 0} reviews`,
          color: "from-yellow-500 to-orange-500",
        },
        {
          icon: Film,
          label: "Tickets Sold",
          value: cinemaStats.ticketsSoldThisMonth
            ? `${cinemaStats.ticketsSoldThisMonth}`
            : "0",
          change: "This month",
          color: "from-green-500 to-emerald-500",
        },
      ]
    : [];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return {
          icon: TrendingUp,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
        };
      case "down":
        return {
          icon: TrendingDown,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
        };
      case "stable":
        return {
          icon: Minus,
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
        };
      default:
        return {
          icon: Minus,
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
        };
    }
  };

  const handleBookNow = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
            Statistics & Showtimes
          </h2>
          <p className="text-gray-400 text-lg">
            Premium cinema experience at{" "}
            {cinemaInfo?.name || "CineZone Theater"}
          </p>
        </motion.div>

        {/* Stats Cards - 4 columns */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 group overflow-hidden"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-gray-500 text-xs">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid - 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Now Showing */}
          <motion.div
            className="lg:col-span-2 bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    🔥 Now Showing
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Trending this week
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">Today</span>
            </div>

            <div className="space-y-4">
              {trendingMovies && trendingMovies.length > 0 ? (
                trendingMovies.map((movie, idx) => {
                  const trendData = getTrendIcon(movie.trend);
                  const TrendIcon = trendData.icon;

                  return (
                    <motion.div
                      key={movie.id}
                      className="flex gap-4 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-all duration-300 cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      {/* Poster */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-20 h-28 object-cover rounded-lg border border-zinc-700 group-hover:border-orange-500 transition-colors"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded">
                          {movie.badge}
                        </span>

                        {/* Trend Badge */}
                        <div
                          className={`absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 ${trendData.bgColor} backdrop-blur-sm rounded`}
                        >
                          <TrendIcon className={`w-3 h-3 ${trendData.color}`} />
                          <span
                            className={`text-xs font-semibold ${trendData.color}`}
                          >
                            {movie.trendPercent}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-white font-semibold text-lg truncate group-hover:text-orange-400 transition-colors">
                            {movie.title}
                          </h4>

                          {/* Trend Indicator - Desktop */}
                          <div
                            className={`hidden md:flex items-center gap-1 px-2 py-1 ${trendData.bgColor} rounded-lg flex-shrink-0`}
                          >
                            <TrendIcon
                              className={`w-4 h-4 ${trendData.color}`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-semibold">
                            {movie.rating}
                          </span>
                          <span className="text-gray-500 text-sm">
                            • {movie.seats}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{movie.showtime}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => handleBookNow(movie.id)}
                        className="self-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap"
                      >
                        Book Now
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No trending movies available at the moment
                </p>
              )}
            </div>

            {/* Legend - Trend explanation */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-xs text-gray-400">Trending Up</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 rounded">
                  <Minus className="w-3 h-3 text-gray-400" />
                </div>
                <span className="text-xs text-gray-400">Stable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-xs text-gray-400">Trending Down</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/movies")}
              className="w-full mt-4 py-3 border border-zinc-700 hover:border-orange-500 text-gray-400 hover:text-orange-400 rounded-lg transition-all duration-300 font-medium"
            >
              View Full Schedule →
            </button>
          </motion.div>

          {/* Column 2: Sidebar */}
          <div className="space-y-6">
            {/* Coming Soon */}
            <motion.div
              className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Coming Soon</h3>
              </div>

              <div className="space-y-3">
                {comingSoonMovies && comingSoonMovies.length > 0 ? (
                  comingSoonMovies.map((movie, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-all duration-300 cursor-pointer group"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
                          {movie.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-gray-500 text-xs">{movie.genre}</p>
                          {movie.preOrder && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                              Pre-Order
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-blue-400 text-xs font-semibold">
                          {movie.date}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No upcoming movies
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate("/movies")}
                className="w-full mt-4 py-2.5 border border-zinc-700 hover:border-blue-500 text-gray-400 hover:text-blue-400 rounded-lg transition-all duration-300 text-sm font-medium"
              >
                View Coming Soon →
              </button>
            </motion.div>

            {/* Cinema Info */}
            {cinemaInfo && (
              <motion.div
                className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Cinema Info</h3>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Address</p>
                    <p className="text-white text-sm font-medium">
                      📍 {cinemaInfo.address}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs mb-1">Screens</p>
                      <p className="text-white font-semibold">
                        {cinemaInfo.screens} screens
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs mb-1">Seats</p>
                      <p className="text-white font-semibold">
                        {cinemaInfo.seats} seats
                      </p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {cinemaInfo.facilities?.map((facility, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="bg-zinc-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Opening Hours</p>
                    <p className="text-white text-sm font-medium">
                      🕐 {cinemaInfo.openHours}
                    </p>
                    <p className="text-green-400 text-xs mt-1">
                      🅿️ {cinemaInfo.parking}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
