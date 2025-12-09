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

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllBookings,
//   cancelBooking,
//   confirmBooking,
//   getBookingStatistics,
// } from "../../service/AdminService";
// import {
//   setBookings,
//   setBookingsLoading,
//   setBookingsError,
//   setBookingStatistics,
// } from "../../redux/reducer/AdminReducer";
// import Title from "../../components/admin/Title";
// import { toast } from "react-toastify";

// const ListBookings = () => {
//   const dispatch = useDispatch();
//   const {
//     data: bookings,
//     loading,
//     currentPage,
//     totalPages,
//     statistics,
//   } = useSelector((state) => state.admin.bookings);
//   const [page, setPage] = useState(0);
//   const [filters, setFilters] = useState({
//     userId: "",
//     showId: "",
//     status: "",
//     fromDate: "",
//     toDate: "",
//   });
//   const [showDetail, setShowDetail] = useState(null);

//   useEffect(() => {
//     fetchBookings();
//     fetchStatistics();
//   }, [page, filters]);

//   const fetchBookings = async () => {
//     try {
//       dispatch(setBookingsLoading(true));
//       const response = await getAllBookings({
//         page,
//         size: 10,
//         ...filters,
//       });
//       dispatch(setBookings(response.result));
//     } catch (error) {
//       dispatch(setBookingsError(error.message));
//       toast.error("Failed to fetch bookings");
//     }
//   };

//   const fetchStatistics = async () => {
//     try {
//       const response = await getBookingStatistics(
//         filters.fromDate || null,
//         filters.toDate || null
//       );
//       dispatch(setBookingStatistics(response.result));
//     } catch (error) {
//       console.error("Failed to fetch statistics");
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setPage(0);
//   };

//   const handleCancel = async (bookingId) => {
//     if (window.confirm("Are you sure you want to cancel this booking?")) {
//       try {
//         await cancelBooking(bookingId);
//         toast.success("Booking cancelled successfully");
//         fetchBookings();
//         fetchStatistics();
//       } catch (error) {
//         toast.error("Failed to cancel booking");
//       }
//     }
//   };

//   const handleConfirm = async (bookingId) => {
//     try {
//       await confirmBooking(bookingId);
//       toast.success("Booking confirmed successfully");
//       fetchBookings();
//       fetchStatistics();
//     } catch (error) {
//       toast.error("Failed to confirm booking");
//     }
//   };

//   const resetFilters = () => {
//     setFilters({
//       userId: "",
//       showId: "",
//       status: "",
//       fromDate: "",
//       toDate: "",
//     });
//     setPage(0);
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toUpperCase()) {
//       case "CONFIRMED":
//         return "bg-green-100 text-green-800";
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-800";
//       case "CANCELLED":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="p-6">
//       <Title title="Booking Management" />

//       {/* Statistics Cards */}
//       {statistics && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-sm text-gray-500 mb-1">Total Bookings</div>
//             <div className="text-2xl font-bold text-gray-900">
//               {statistics.totalBookings}
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
//             <div className="text-2xl font-bold text-green-600">
//               ${statistics.totalRevenue?.toFixed(2)}
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-sm text-gray-500 mb-1">Confirmed</div>
//             <div className="text-2xl font-bold text-blue-600">
//               {statistics.confirmedBookings}
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="text-sm text-gray-500 mb-1">Cancelled</div>
//             <div className="text-2xl font-bold text-red-600">
//               {statistics.cancelledBookings}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="mb-6 bg-white rounded-lg shadow p-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               User ID
//             </label>
//             <input
//               type="text"
//               name="userId"
//               value={filters.userId}
//               onChange={handleFilterChange}
//               placeholder="Enter user ID"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Show ID
//             </label>
//             <input
//               type="text"
//               name="showId"
//               value={filters.showId}
//               onChange={handleFilterChange}
//               placeholder="Enter show ID"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Status
//             </label>
//             <select
//               name="status"
//               value={filters.status}
//               onChange={handleFilterChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="PENDING">Pending</option>
//               <option value="CONFIRMED">Confirmed</option>
//               <option value="CANCELLED">Cancelled</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               From Date
//             </label>
//             <input
//               type="date"
//               name="fromDate"
//               value={filters.fromDate}
//               onChange={handleFilterChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               To Date
//             </label>
//             <input
//               type="date"
//               name="toDate"
//               value={filters.toDate}
//               onChange={handleFilterChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         <div className="mt-4">
//           <button
//             onClick={resetFilters}
//             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//           >
//             Reset Filters
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : (
//         <>
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Booking ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Movie
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Show Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Seats
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Total Price
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {bookings.map((booking) => (
//                   <tr key={booking.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{booking.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm">
//                         <div className="font-medium text-gray-900">
//                           {booking.user?.username}
//                         </div>
//                         <div className="text-gray-500">
//                           {booking.user?.email}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <img
//                           src={
//                             booking.show?.movie?.posterUrl || "/placeholder.jpg"
//                           }
//                           alt={booking.show?.movie?.title}
//                           className="w-10 h-14 object-cover rounded mr-3"
//                         />
//                         <div className="text-sm font-medium text-gray-900">
//                           {booking.show?.movie?.title}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div>{booking.show?.showDate}</div>
//                       <div>{booking.show?.startTime}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => setShowDetail(booking)}
//                         className="text-blue-600 hover:text-blue-900 text-sm"
//                       >
//                         {booking.bookingDetails?.length} seats
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       ${booking.totalPrice?.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 text-xs rounded ${getStatusColor(
//                           booking.status
//                         )}`}
//                       >
//                         {booking.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {booking.status === "PENDING" && (
//                         <>
//                           <button
//                             onClick={() => handleConfirm(booking.id)}
//                             className="text-green-600 hover:text-green-900 mr-3"
//                           >
//                             Confirm
//                           </button>
//                           <button
//                             onClick={() => handleCancel(booking.id)}
//                             className="text-red-600 hover:text-red-900"
//                           >
//                             Cancel
//                           </button>
//                         </>
//                       )}
//                       {booking.status === "CONFIRMED" && (
//                         <button
//                           onClick={() => handleCancel(booking.id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="mt-4 flex justify-center items-center space-x-2">
//             <button
//               onClick={() => setPage((p) => Math.max(0, p - 1))}
//               disabled={page === 0}
//               className="px-4 py-2 border rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="px-4 py-2">
//               Page {page + 1} of {totalPages}
//             </span>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
//               disabled={page >= totalPages - 1}
//               className="px-4 py-2 border rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}

//       {/* Booking Detail Modal */}
//       {showDetail && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Booking Details</h3>
//               <button
//                 onClick={() => setShowDetail(null)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-semibold text-gray-700 mb-2">
//                   Movie Information
//                 </h4>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <p>
//                     <strong>Title:</strong> {showDetail.show?.movie?.title}
//                   </p>
//                   <p>
//                     <strong>Date:</strong> {showDetail.show?.showDate}
//                   </p>
//                   <p>
//                     <strong>Time:</strong> {showDetail.show?.startTime} -{" "}
//                     {showDetail.show?.endTime}
//                   </p>
//                   <p>
//                     <strong>Hall:</strong> {showDetail.show?.hallNumber}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-700 mb-2">
//                   Booked Seats
//                 </h4>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <div className="grid grid-cols-4 gap-2">
//                     {showDetail.bookingDetails?.map((detail, index) => (
//                       <div
//                         key={index}
//                         className="bg-blue-100 text-blue-800 px-3 py-2 rounded text-center text-sm font-medium"
//                       >
//                         {detail.seatInstance?.seat?.seatNumber}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-700 mb-2">
//                   Payment Information
//                 </h4>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <p>
//                     <strong>Total Price:</strong> $
//                     {showDetail.totalPrice?.toFixed(2)}
//                   </p>
//                   <p>
//                     <strong>Payment Method:</strong>{" "}
//                     {showDetail.paymentMethod || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Status:</strong> {showDetail.status}
//                   </p>
//                   <p>
//                     <strong>Booking Date:</strong> {showDetail.bookingDate}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-700 mb-2">
//                   Customer Information
//                 </h4>
//                 <div className="bg-gray-50 p-4 rounded">
//                   <p>
//                     <strong>Name:</strong> {showDetail.user?.username}
//                   </p>
//                   <p>
//                     <strong>Email:</strong> {showDetail.user?.email}
//                   </p>
//                   <p>
//                     <strong>Phone:</strong>{" "}
//                     {showDetail.user?.phoneNumber || "N/A"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListBookings;
