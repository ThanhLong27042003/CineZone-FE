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
  LineElement,
);

const DashBoard = () => {
  const dispatch = useDispatch();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const { statistics } = useSelector((state) => state.admin.bookings);
  const { revenueByDate, topMovies, loading } = useSelector(
    (state) => state.admin.analytics,
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
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
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
          "rgba(107, 114, 128, 0.8)",
          "rgba(156, 163, 175, 0.8)",
          "rgba(75, 85, 99, 0.8)",
          "rgba(31, 41, 55, 0.8)",
          "rgba(17, 24, 39, 0.8)",
          "rgba(209, 213, 219, 0.8)",
          "rgba(229, 231, 235, 0.8)",
          "rgba(243, 244, 246, 0.8)",
          "rgba(249, 250, 251, 0.8)",
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
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title text1="Admin" text2="Dashboard" icon={FaChartLine} />

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FaClock className="text-gray-600" />
          <h3 className="font-bold text-gray-800">Date Range</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={dateRange.fromDate}
              onChange={handleDateRangeChange}
              className="w-full px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                       focus:border-gray-400 transition-all outline-none text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={dateRange.toDate}
              onChange={handleDateRangeChange}
              className="w-full px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                       focus:border-gray-400 transition-all outline-none text-black"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Bookings",
            value: statistics?.totalBookings || 0,
            icon: FaTicketAlt,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            title: "Total Revenue",
            value: `${currency}${((statistics?.totalRevenue || 0) / 100).toFixed(2)}`,
            icon: FaDollarSign,
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
          },
          {
            title: "Confirmed",
            value: statistics?.confirmedBookings || 0,
            icon: FaCheck,
            bgColor: "bg-gray-50",
            iconColor: "text-gray-600",
          },
          {
            title: "Cancelled",
            value: statistics?.cancelledBookings || 0,
            icon: FaTimes,
            bgColor: "bg-red-50",
            iconColor: "text-red-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`text-2xl ${stat.iconColor}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1 text-gray-900">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <FaChartLine />
            Revenue Overview
          </h3>
          <div style={{ height: "300px" }}>
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">
            Booking Status
          </h3>
          <div style={{ height: "300px" }}>
            <Pie data={statusChartData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Top Movies */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          Top 10 Movies by Bookings
        </h3>
        <div style={{ height: "400px" }}>
          <Bar data={topMoviesChartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Movies Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900">
            Popular Movies Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 text-white">
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
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {movie.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">
                      {movie.bookingCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600">
                      {currency}
                      {(movie.revenue / 100).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
