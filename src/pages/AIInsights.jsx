import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBrain,
  FaRobot,
  FaChartLine,
  FaCalendarAlt,
  FaLightbulb,
  FaSync,
  FaMagic,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Title from "../components/admin/Title";
import {
  getAIAnalytics,
  getAIServiceStatus,
  optimizeSchedule,
  trainModel,
} from "../service/admin/AIService";

const AIInsights = () => {
  const [aiStatus, setAIStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [optimizedSchedule, setOptimizedSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trainingModel, setTrainingModel] = useState(false);

  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const res = await getAIServiceStatus();
      setAIStatus(res);

      if (res.available) {
        toast.success("🤖 AI Service Online");
        fetchAnalytics();
      } else {
        toast.error("⚠️ AI Service Offline");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getAIAnalytics();
      setAnalytics(res);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const generateOptimizedSchedule = async () => {
    setLoading(true);
    try {
      // const res = await fetch("/api/admin/ai/optimize-schedule", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     rooms: [1, 2, 3],
      //     dateRange: {
      //       start: new Date().toISOString().split("T")[0],
      //       end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      //         .toISOString()
      //         .split("T")[0],
      //     },
      //     constraints: {
      //       maxShowsPerDay: 10,
      //       minBreakBetweenShows: 30,
      //     },
      //   }),
      // });

      const res = await optimizeSchedule(
        [1, 2, 3],
        {
          start: new Date().toISOString().split("T")[0],
          end: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          maxShowsPerDay: 10,
          minBreakBetweenShows: 30,
        }
      );
      setOptimizedSchedule(res);
      toast.success(`✨ Generated ${res.length} optimized shows!`);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const trainAIModel = async () => {
    setTrainingModel(true);
    try {
      const res = await trainModel();
      // toast.success(res);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setTrainingModel(false);
    }
  };

  return (
    <div className="space-y-6">
      <Title text1="AI" text2="Insights" icon={FaBrain} />

      {/* AI Status Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-4 rounded-xl ${
                aiStatus?.available
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              <FaRobot
                className={`text-3xl ${
                  aiStatus?.available ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Service Status
              </h3>
              <p
                className={`text-sm ${
                  aiStatus?.available
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {aiStatus?.available ? "✅ Operational" : "❌ Offline"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkAIStatus}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600
                       flex items-center gap-2"
            >
              <FaSync /> Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={trainAIModel}
              disabled={trainingModel || !aiStatus?.available}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500
                       text-white disabled:opacity-50 flex items-center gap-2"
            >
              <FaBrain />
              {trainingModel ? "Training..." : "Train Model"}
            </motion.button>
          </div>
        </div>

        {aiStatus?.features && (
          <div className="mt-4 flex flex-wrap gap-2">
            {aiStatus.features.map((feature, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30
                         text-purple-700 dark:text-purple-300 text-sm font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Analytics Section */}
      {analytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FaLightbulb className="text-yellow-500 text-2xl" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Insights
              </h3>
            </div>

            <div className="space-y-3">
              {analytics.insights?.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20
                           border-l-4 border-blue-500"
                >
                  <p className="text-gray-700 dark:text-gray-300">{insight}</p>
                </motion.div>
              ))}
            </div>

            {analytics.total_revenue && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">
                      ${analytics.total_revenue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bookings</p>
                    <p className="text-xl font-bold text-blue-600">
                      {analytics.total_bookings}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Price</p>
                    <p className="text-xl font-bold text-purple-600">
                      ${analytics.average_ticket_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <FaMagic className="text-purple-500 text-2xl" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Recommendations
              </h3>
            </div>

            <div className="space-y-3">
              {analytics.recommendations?.map((rec, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50
                           dark:from-purple-900/20 dark:to-pink-900/20
                           border-l-4 border-purple-500"
                >
                  <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Schedule Optimization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-green-500 text-2xl" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Schedule Optimizer
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateOptimizedSchedule}
            disabled={loading || !aiStatus?.available}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500
                     text-white font-medium disabled:opacity-50 flex items-center gap-2
                     shadow-lg hover:shadow-xl"
          >
            <FaMagic />
            {loading ? "Generating..." : "Generate Optimal Schedule"}
          </motion.button>
        </div>

        {optimizedSchedule.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <th className="px-4 py-3 text-left">Movie</th>
                  <th className="px-4 py-3 text-left">Room</th>
                  <th className="px-4 py-3 text-left">Date & Time</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Pred. Demand</th>
                  <th className="px-4 py-3 text-left">Reasoning</th>
                </tr>
              </thead>
              <tbody>
                {optimizedSchedule.slice(0, 10).map((show, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700
                             hover:bg-green-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 font-medium">{show.movieTitle}</td>
                    <td className="px-4 py-3">Room {show.roomId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-blue-500" />
                        {new Date(show.showDateTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600">
                      ${show.price}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                        {show.predictedDemand} seats
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {show.reasoning}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {optimizedSchedule.length > 10 && (
              <p className="text-center mt-4 text-gray-500">
                Showing 10 of {optimizedSchedule.length} optimized shows
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AIInsights;
