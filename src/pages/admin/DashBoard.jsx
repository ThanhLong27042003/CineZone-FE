// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaFilm,
//   FaTicketAlt,
//   FaUsers,
//   FaDollarSign,
//   FaArrowUp,
//   FaArrowDown,
// } from "react-icons/fa";
// import { Line, Bar, Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const DashBoard = () => {
//   const stats = [
//     {
//       title: "Total Shows",
//       value: "124",
//       change: "+12%",
//       isUp: true,
//       icon: FaFilm,
//       color: "from-blue-500 to-cyan-500",
//       bgColor: "bg-blue-500/10",
//     },
//     {
//       title: "Bookings",
//       value: "1,429",
//       change: "+8%",
//       isUp: true,
//       icon: FaTicketAlt,
//       color: "from-purple-500 to-pink-500",
//       bgColor: "bg-purple-500/10",
//     },
//     {
//       title: "Total Users",
//       value: "3,842",
//       change: "-3%",
//       isUp: false,
//       icon: FaUsers,
//       color: "from-green-500 to-emerald-500",
//       bgColor: "bg-green-500/10",
//     },
//     {
//       title: "Revenue",
//       value: "$28,450",
//       change: "+18%",
//       isUp: true,
//       icon: FaDollarSign,
//       color: "from-orange-500 to-red-500",
//       bgColor: "bg-orange-500/10",
//     },
//   ];

//   const lineData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [
//       {
//         label: "Revenue",
//         data: [12000, 19000, 15000, 25000, 22000, 28450],
//         borderColor: "rgb(147, 51, 234)",
//         backgroundColor: "rgba(147, 51, 234, 0.1)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   const barData = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         label: "Bookings",
//         data: [65, 89, 80, 81, 156, 255, 240],
//         backgroundColor: [
//           "rgba(59, 130, 246, 0.8)",
//           "rgba(147, 51, 234, 0.8)",
//           "rgba(236, 72, 153, 0.8)",
//           "rgba(34, 197, 94, 0.8)",
//           "rgba(251, 146, 60, 0.8)",
//           "rgba(239, 68, 68, 0.8)",
//           "rgba(168, 85, 247, 0.8)",
//         ],
//       },
//     ],
//   };

//   const doughnutData = {
//     labels: ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"],
//     datasets: [
//       {
//         data: [30, 25, 20, 15, 10],
//         backgroundColor: [
//           "rgba(59, 130, 246, 0.8)",
//           "rgba(147, 51, 234, 0.8)",
//           "rgba(236, 72, 153, 0.8)",
//           "rgba(34, 197, 94, 0.8)",
//           "rgba(251, 146, 60, 0.8)",
//         ],
//       },
//     ],
//   };

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };

//   const item = {
//     hidden: { y: 20, opacity: 0 },
//     show: { y: 0, opacity: 1 },
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Stats Grid */}
//       <motion.div
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//       >
//         {stats.map((stat, index) => (
//           <motion.div
//             key={index}
//             variants={item}
//             whileHover={{ scale: 1.05, y: -5 }}
//             className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800
//                      p-6 shadow-xl border border-gray-200 dark:border-gray-700"
//           >
//             {/* Background Gradient */}
//             <div
//               className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color}
//                           opacity-10 rounded-full -mr-16 -mt-16`}
//             />

//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-3 rounded-xl ${stat.bgColor}`}>
//                   <stat.icon
//                     className={`text-2xl bg-gradient-to-br ${stat.color}
//                                         bg-clip-text text-transparent`}
//                   />
//                 </div>
//                 <div
//                   className={`flex items-center gap-1 text-sm font-semibold
//                               ${stat.isUp ? "text-green-500" : "text-red-500"}`}
//                 >
//                   {stat.isUp ? <FaArrowUp /> : <FaArrowDown />}
//                   {stat.change}
//                 </div>
//               </div>

//               <h3
//                 className="text-3xl font-bold mb-1 bg-gradient-to-br ${stat.color}
//                            bg-clip-text text-transparent"
//               >
//                 {stat.value}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">
//                 {stat.title}
//               </p>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Revenue Chart */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl
//                    border border-gray-200 dark:border-gray-700"
//         >
//           <h3
//             className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500
//                        bg-clip-text text-transparent"
//           >
//             Revenue Overview
//           </h3>
//           <Line
//             data={lineData}
//             options={{ responsive: true, maintainAspectRatio: true }}
//           />
//         </motion.div>

//         {/* Genre Distribution */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl
//                    border border-gray-200 dark:border-gray-700"
//         >
//           <h3
//             className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500
//                        bg-clip-text text-transparent"
//           >
//             Genre Distribution
//           </h3>
//           <Doughnut
//             data={doughnutData}
//             options={{ responsive: true, maintainAspectRatio: true }}
//           />
//         </motion.div>
//       </div>

//       {/* Weekly Bookings */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6 }}
//         className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl
//                  border border-gray-200 dark:border-gray-700"
//       >
//         <h3
//           className="text-xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-500
//                      bg-clip-text text-transparent"
//         >
//           Weekly Bookings
//         </h3>
//         <Bar
//           data={barData}
//           options={{ responsive: true, maintainAspectRatio: true }}
//         />
//       </motion.div>
//     </div>
//   );
// };

// export default DashBoard;

import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { getAllMoviesForAdmin } from "../../service/admin/MovieService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

const DashBoard = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const [moviesResponse] = await Promise.all([getAllMoviesForAdmin(0, 10)]);

      setTopMovies(moviesResponse.result.content);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <Title title="Dashboard" />
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title title="Dashboard" />

      {/* Date Range Filter */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="bg-red-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top Movies */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Popular Movies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topMovies.map((movie) => (
            <div
              key={movie.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={movie.posterUrl || "/placeholder.jpg"}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h4 className="font-semibold text-sm truncate">
                  {movie.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {movie.duration} min
                </p>
                <div className="flex items-center mt-2">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs ml-1">{movie.rating || "N/A"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
