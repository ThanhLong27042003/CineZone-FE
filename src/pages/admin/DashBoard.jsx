import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import {
  setBookingStatistics,
  setRevenueByDate,
  setTopMovies,
  setAnalyticsLoading,
} from "../../redux/reducer/AdminReducer";
import {
  getBookingStatistics,
  getRevenueByDate,
  getTopMovies,
} from "../../service/admin/BookingService";
import { motion } from "framer-motion";
import {
  FaTicketAlt,
  FaDollarSign,
  FaCheck,
  FaTimes,
  FaChartLine,
  FaClock,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DashBoard = () => {
  const dispatch = useDispatch();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const { statistics } = useSelector((state) => state.admin.bookings);
  const { revenueByDate, topMovies, loading } = useSelector(
    (state) => state.admin.analytics
  );

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    dispatch(setAnalyticsLoading(true));
    try {
      const [statsResponse, revenueResponse, topMoviesResponse] =
        await Promise.all([
          getBookingStatistics(dateRange.fromDate, dateRange.toDate),
          getRevenueByDate(dateRange.fromDate, dateRange.toDate),
          getTopMovies(dateRange.fromDate, dateRange.toDate, 10),
        ]);

      dispatch(setBookingStatistics(statsResponse));
      dispatch(setRevenueByDate(revenueResponse));
      dispatch(setTopMovies(topMoviesResponse));
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      dispatch(setAnalyticsLoading(false));
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Chart Data
  const revenueChartData = {
    labels: revenueByDate?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Revenue",
        data: revenueByDate?.map((item) => item.revenue / 100) || [],
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const topMoviesChartData = {
    labels: topMovies?.map((item) => item.title) || [],
    datasets: [
      {
        label: "Bookings",
        data: topMovies?.map((item) => item.bookingCount) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
      },
    ],
  };

  const statusChartData = {
    labels: ["Confirmed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          statistics?.confirmedBookings || 0,
          statistics?.pendingBookings || 0,
          statistics?.cancelledBookings || 0,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title text1="Admin" text2="Dashboard" icon={FaChartLine} />

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaClock className="text-purple-500" />
          <h3 className="font-bold text-gray-800 dark:text-white">
            Date Range
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={dateRange.fromDate}
              onChange={handleDateRangeChange}
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 
                       border-2 border-gray-200 dark:border-gray-600 
                       focus:border-purple-500 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={dateRange.toDate}
              onChange={handleDateRangeChange}
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-700 
                       border-2 border-gray-200 dark:border-gray-600 
                       focus:border-purple-500 transition-all outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: "Total Bookings",
            value: statistics?.totalBookings || 0,
            change: "+12%",
            isUp: true,
            icon: FaTicketAlt,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10",
          },
          {
            title: "Total Revenue",
            value: `${currency}${(
              (statistics?.totalRevenue || 0) / 100
            ).toFixed(2)}`,
            change: "+18%",
            isUp: true,
            icon: FaDollarSign,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10",
          },
          {
            title: "Confirmed",
            value: statistics?.confirmedBookings || 0,
            change: "+8%",
            isUp: true,
            icon: FaCheck,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/10",
          },
          {
            title: "Cancelled",
            value: statistics?.cancelledBookings || 0,
            change: "-3%",
            isUp: false,
            icon: FaTimes,
            color: "from-red-500 to-orange-500",
            bgColor: "bg-red-500/10",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800
                     p-6 shadow-xl border border-gray-200 dark:border-gray-700"
          >
            {/* Background Gradient */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color}
                          opacity-10 rounded-full -mr-16 -mt-16`}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon
                    className={`text-2xl bg-gradient-to-br ${stat.color}
                                       bg-clip-text text-transparent`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold
                              ${stat.isUp ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.isUp ? "↑" : "↓"}
                  {stat.change}
                </div>
              </div>

              <h3 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.title}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl
                   border border-gray-200 dark:border-gray-700"
        >
          <h3
            className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500
                       bg-clip-text text-transparent flex items-center gap-2"
          >
            <FaChartLine />
            Revenue Overview
          </h3>
          <div style={{ height: "300px" }}>
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl
                   border border-gray-200 dark:border-gray-700"
        >
          <h3
            className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500
                       bg-clip-text text-transparent"
          >
            Booking Status
          </h3>
          <div style={{ height: "300px" }}>
            <Pie data={statusChartData} options={pieOptions} />
          </div>
        </motion.div>
      </div>

      {/* Top Movies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl
                 border border-gray-200 dark:border-gray-700"
      >
        <h3
          className="text-xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-500
                     bg-clip-text text-transparent"
        >
          Top 10 Movies by Bookings
        </h3>
        <div style={{ height: "400px" }}>
          <Bar data={topMoviesChartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Top Movies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden
                 border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6">
          <h3
            className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500
                       bg-clip-text text-transparent"
          >
            Popular Movies Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <th className="px-6 py-4 text-left font-semibold">Rank</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Movie Title
                </th>
                <th className="px-6 py-4 text-left font-semibold">Bookings</th>
                <th className="px-6 py-4 text-left font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topMovies?.map((movie, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-200 dark:border-gray-700
                           hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500
                                 flex items-center justify-center text-white font-bold"
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {movie.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {movie.bookingCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {currency}
                      {(movie.revenue / 100).toFixed(2)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashBoard;
