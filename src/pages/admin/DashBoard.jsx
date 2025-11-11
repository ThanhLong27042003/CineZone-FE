// import {
//   ChartLineIcon,
//   CircleDollarSignIcon,
//   PlayCircleIcon,
//   StarIcon,
//   UserIcon,
// } from "lucide-react";
// import React, { useEffect } from "react";
// import { useState } from "react";
// import { dummyDashboardData } from "../../assets/assets";
// import Loading from "../../components/Loading";
// import Title from "../../components/admin/Title";
// import BlurCircle from "../../components/BlurCircle";
// import { dateFormat } from "../../../utils/dateFormat";
// const DashBoard = () => {
//   const currency = import.meta.env.VITE_CURRENCY;

//   const [dashboardData, setDashboardData] = useState({
//     totalBookings: 0,
//     totalRevenue: 0,
//     activeShows: [],
//     totalUser: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   const dashboardCards = [
//     {
//       title: "Total Bookings",
//       value: dashboardData.totalBookings || "0",
//       icon: ChartLineIcon,
//     },
//     {
//       title: "Total Revenue",
//       value: dashboardData.totalRevenue || "0",
//       icon: CircleDollarSignIcon,
//     },
//     {
//       title: "Active Shows",
//       value: dashboardData.activeShows.length || "0",
//       icon: PlayCircleIcon,
//     },
//     {
//       title: "Total User",
//       value: dashboardData.totalUser || "0",
//       icon: UserIcon,
//     },
//   ];

//   const fetchDashboardData = async () => {
//     setDashboardData(dummyDashboardData);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);
//   return !loading ? (
//     <div>
//       <>
//         <Title text1="Admin" text2="Dashboard" />

//         <div className="relative flex flex-wrap gap-4 mt-6">
//           <BlurCircle top="-100px" left="0" />
//           <div className="flex flex-wrap gap-4 w-full">
//             {dashboardCards.map((card, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
//               >
//                 <div>
//                   <h1 className="text-sm">{card.title}</h1>
//                   <p className="text-xl font-medium mt-1">{card.value}</p>
//                 </div>
//                 <card.icon className="w-6 h-6" />
//               </div>
//             ))}
//           </div>
//         </div>
//         <p className="mt-10 text-lg font-medium">Active Shows</p>
//         <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
//           <BlurCircle top="100px" left="-10%" />
//           {dashboardData.activeShows.map((show) => (
//             <div
//               key={show._id}
//               className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300"
//             >
//               <img
//                 src={show.movie.poster_path}
//                 alt=""
//                 className="h-60 w-full object-cover"
//               />
//               <p className="font-medium p-2 truncate">{show.movie.title}</p>
//               <div className="flex items-center justify-between px-2">
//                 <p className="text-lg font-medium">
//                   {currency}.{show.showPrice}
//                 </p>
//                 <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
//                   <StarIcon className="w-4 h-4 text-primary fill-primary" />
//                   {show.movie.vote_average.toFixed(1)}
//                 </p>
//               </div>
//               <p className="px-2 pt-2 text-sm text-gray-500">
//                 {dateFormat(show.showDateTime)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </>
//     </div>
//   ) : (
//     <Loading />
//   );
// };

// export default DashBoard;

import React from "react";
import { motion } from "framer-motion";
import {
  FaFilm,
  FaTicketAlt,
  FaUsers,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashBoard = () => {
  const stats = [
    {
      title: "Total Shows",
      value: "124",
      change: "+12%",
      isUp: true,
      icon: FaFilm,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Bookings",
      value: "1,429",
      change: "+8%",
      isUp: true,
      icon: FaTicketAlt,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Users",
      value: "3,842",
      change: "-3%",
      isUp: false,
      icon: FaUsers,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Revenue",
      value: "$28,450",
      change: "+18%",
      isUp: true,
      icon: FaDollarSign,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 19000, 15000, 25000, 22000, 28450],
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Bookings",
        data: [65, 89, 80, 81, 156, 255, 240],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
      },
    ],
  };

  const doughnutData = {
    labels: ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
      },
    ],
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={item}
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
                  {stat.isUp ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.change}
                </div>
              </div>

              <h3
                className="text-3xl font-bold mb-1 bg-gradient-to-br ${stat.color} 
                           bg-clip-text text-transparent"
              >
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
                       bg-clip-text text-transparent"
          >
            Revenue Overview
          </h3>
          <Line
            data={lineData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </motion.div>

        {/* Genre Distribution */}
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
            Genre Distribution
          </h3>
          <Doughnut
            data={doughnutData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </motion.div>
      </div>

      {/* Weekly Bookings */}
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
          Weekly Bookings
        </h3>
        <Bar
          data={barData}
          options={{ responsive: true, maintainAspectRatio: true }}
        />
      </motion.div>
    </div>
  );
};

export default DashBoard;
