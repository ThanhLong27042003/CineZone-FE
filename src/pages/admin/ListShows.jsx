// import React, { useEffect, useState } from "react";
// import { dummyShowsData } from "../../assets/assets";
// import Loading from "../../components/Loading";
// import Title from "../../components/admin/Title";
// import { dateFormat } from "../../../utils/dateFormat";

// const ListShows = () => {
//   const currency = import.meta.env.VITE_CURRENCY;

//   const [shows, setShows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getAllShows = async () => {
//     try {
//       setShows([
//         {
//           movie: dummyShowsData[0],
//           showDateTime: "2025-06-30T02:30:00.000Z",
//           showPrice: 59,
//           occupiedSeats: {
//             A1: "user_1",
//             B1: "user_2",
//             C1: "user_3",
//           },
//         },
//       ]);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   useEffect(() => {
//     getAllShows();
//   }, []);
//   return !loading ? (
//     <>
//       <Title text1="List" text2="Shows" />
//       <div className="max-w-4xl mt-6 overflow-x-auto">
//         <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
//           <thead>
//             <tr className="bg-primary/20 text-left text-white">
//               <th className="p-2 font-medium pl-5">Movie Name</th>
//               <th className="p-2 font-medium">Show Time</th>
//               <th className="p-2 font-medium">Total Bookings</th>
//               <th className="p-2 font-medium">Earnings</th>
//             </tr>
//           </thead>
//           <tbody className="text-sm font-light">
//             {shows.map((show, index) => (
//               <tr
//                 key={index}
//                 className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
//               >
//                 <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
//                 <td className="p-2">{dateFormat(show.showDateTime)}</td>
//                 <td className="p-2">
//                   {Object.keys(show.occupiedSeats).length}
//                 </td>
//                 <td className="p-2">
//                   {currency}{" "}
//                   {Object.keys(show.occupiedSeats).length * show.showPrice}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   ) : (
//     <Loading />
//   );
// };

// export default ListShows;

import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../../utils/dateFormat";
import { motion } from "framer-motion";
import {
  FaFilm,
  FaClock,
  FaTicketAlt,
  FaDollarSign,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllShows = async () => {
    try {
      setShows([
        {
          movie: dummyShowsData[0],
          showDateTime: "2025-06-30T02:30:00.000Z",
          showPrice: 59,
          occupiedSeats: {
            A1: "user_1",
            B1: "user_2",
            C1: "user_3",
          },
        },
      ]);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllShows();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return !loading ? (
    <div className="space-y-6">
      <Title text1="List" text2="Shows" icon={FaFilm} />

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700 
                     focus:border-purple-500 transition-all outline-none shadow-lg"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                   text-white font-medium shadow-lg hover:shadow-xl transition-all
                   flex items-center gap-2 justify-center"
        >
          <FaFilter /> Filter
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            label: "Total Shows",
            value: shows.length,
            icon: FaFilm,
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Total Bookings",
            value: shows.reduce(
              (acc, s) => acc + Object.keys(s.occupiedSeats).length,
              0
            ),
            icon: FaTicketAlt,
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "Revenue",
            value: `${currency} ${shows.reduce(
              (acc, s) =>
                acc + Object.keys(s.occupiedSeats).length * s.showPrice,
              0
            )}`,
            icon: FaDollarSign,
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Avg Occupancy",
            value: "67%",
            icon: FaClock,
            color: "from-orange-500 to-red-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
              >
                <stat.icon
                  className={`text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <th className="px-6 py-4 text-left font-semibold">
                  Movie Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">Show Time</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Total Bookings
                </th>
                <th className="px-6 py-4 text-left font-semibold">Earnings</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-200 dark:border-gray-700 
                           hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 
                                    flex items-center justify-center text-white font-bold"
                      >
                        {show.movie.title.charAt(0)}
                      </div>
                      <span className="font-medium">{show.movie.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaClock className="text-purple-500" />
                      {dateFormat(show.showDateTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 
                                   text-purple-700 dark:text-purple-300 font-medium text-sm"
                    >
                      {Object.keys(show.occupiedSeats).length} bookings
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {currency}{" "}
                      {Object.keys(show.occupiedSeats).length * show.showPrice}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  ) : (
    <Loading />
  );
};

export default ListShows;
