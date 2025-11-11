// import React, { useEffect, useState } from "react";
// import { dummyBookingData } from "../../assets/assets";
// import Loading from "../../components/Loading";
// import Title from "../../components/admin/Title";
// import { dateFormat } from "../../../utils/dateFormat";

// const ListBookings = () => {
//   const currency = import.meta.env.VITE_CURRENCY;

//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getAllBookings = async () => {
//     setBookings(dummyBookingData);
//     setLoading(false);
//   };

//   useEffect(() => {
//     getAllBookings();
//   }, []);
//   return !loading ? (
//     <>
//       <Title text1="List" text2="Bookings" />
//       <div className="max-w-4xl mt-6 overflow-x-auto">
//         <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
//           <thead>
//             <tr className="bg-primary/20 text-left text-white">
//               <th className="p-2 font-medium pl-5">User Name</th>
//               <th className="p-2 font-medium">Movie Time</th>
//               <th className="p-2 font-medium">Show Time</th>
//               <th className="p-2 font-medium">Seats</th>
//               <th className="p-2 font-medium">Amount</th>
//             </tr>
//           </thead>
//           <tbody className="text-sm font-light">
//             {bookings.map((item, index) => (
//               <tr
//                 key={index}
//                 className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
//               >
//                 <td className="p-2 min-w-45 pl-5">{item.user.name}</td>
//                 <td className="p-2">{item.show.movie.title}</td>
//                 <td className="p-2">{dateFormat(item.show.showDateTime)}</td>
//                 <td className="p-2">
//                   {Object.keys(item.bookedSeats)
//                     .map((seat) => item.bookedSeats[seat])
//                     .join(", ")}
//                 </td>
//                 <td className="p-2">
//                   {currency} {item.amount}
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

// export default ListBookings;

import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dateFormat } from "../../../utils/dateFormat";
import { motion } from "framer-motion";
import {
  FaTicketAlt,
  FaUser,
  FaCalendar,
  FaChair,
  FaDollarSign,
  FaDownload,
  FaFilter,
} from "react-icons/fa";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const getAllBookings = async () => {
    setBookings(dummyBookingData);
    setLoading(false);
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  const statusColors = {
    confirmed:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return !loading ? (
    <div className="space-y-6">
      <Title text1="List" text2="Bookings" icon={FaTicketAlt} />

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between gap-4"
      >
        <div className="flex gap-2">
          {["all", "today", "week", "month"].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 
                   text-white font-medium shadow-lg hover:shadow-xl transition-all
                   flex items-center gap-2 justify-center"
        >
          <FaDownload /> Export
        </motion.button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            label: "Total Bookings",
            value: bookings.length,
            icon: FaTicketAlt,
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "Total Revenue",
            value: `${currency} ${bookings.reduce(
              (sum, b) => sum + b.amount,
              0
            )}`,
            icon: FaDollarSign,
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Avg Booking",
            value: `${currency} ${(
              bookings.reduce((sum, b) => sum + b.amount, 0) / bookings.length
            ).toFixed(0)}`,
            icon: FaUser,
            color: "from-blue-500 to-cyan-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
              >
                <stat.icon
                  className={`text-3xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bookings Table */}
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
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Movie</th>
                <th className="px-6 py-4 text-left font-semibold">Show Time</th>
                <th className="px-6 py-4 text-left font-semibold">Seats</th>
                <th className="px-6 py-4 text-left font-semibold">Amount</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((item, index) => (
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
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 
                                    flex items-center justify-center text-white font-bold"
                      >
                        {item.user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{item.user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {item.show.movie.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <FaCalendar className="text-purple-500" />
                      {dateFormat(item.show.showDateTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(item.bookedSeats).map((seat) => (
                        <span
                          key={seat}
                          className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 
                                   text-blue-700 dark:text-blue-300 text-xs font-medium"
                        >
                          {item.bookedSeats[seat]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                      {currency} {item.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.confirmed}`}
                    >
                      Confirmed
                    </span>
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

export default ListBookings;
