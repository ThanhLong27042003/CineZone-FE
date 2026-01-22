// import React from "react";
// import { Ticket } from "lucide-react";

// const BookingHistory = ({ bookingHistory }) => {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-white">Booking History</h2>
//         <div className="flex gap-2">
//           <button className="px-4 py-2 bg-primary hover:bg-primary-dull rounded-lg transition-colors text-sm">
//             All
//           </button>
//           <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-400">
//             Upcoming
//           </button>
//           <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-400">
//             Past
//           </button>
//         </div>
//       </div>

//       {bookingHistory.map((booking) => (
//         <div
//           key={booking.id}
//           className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group"
//         >
//           <div className="flex flex-col md:flex-row gap-6">
//             <img
//               src={booking.poster}
//               alt={booking.movieTitle}
//               className="w-full md:w-24 h-36 object-cover rounded-lg"
//             />

//             <div className="flex-1">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
//                     {booking.movieTitle}
//                   </h3>
//                   <p className="text-gray-400 text-sm">{booking.theater}</p>
//                 </div>
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     booking.status === "Completed"
//                       ? "bg-green-500/20 text-green-400"
//                       : "bg-blue-500/20 text-blue-400"
//                   }`}
//                 >
//                   {booking.status}
//                 </span>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Date</p>
//                   <p className="text-sm text-white font-medium">
//                     {booking.date}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Time</p>
//                   <p className="text-sm text-white font-medium">
//                     {booking.time}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Seats</p>
//                   <p className="text-sm text-white font-medium">
//                     {booking.seats}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Total</p>
//                   <p className="text-sm text-primary font-bold">
//                     {booking.totalPrice}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm">
//                   <Ticket className="w-4 h-4" />
//                   View Ticket
//                 </button>
//                 <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-colors text-sm">
//                   Book Again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BookingHistory;

import React, { useEffect, useState } from "react";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMyBookings, cancelMyBooking } from "../service/BookingService";
import { toast } from "react-hot-toast";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, upcoming, past
  const [cancellingId, setCancellingId] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY || "$";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelMyBooking(bookingId);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh danh sách
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return bookings.filter(
          (b) => new Date(b.showDateTime) > now && b.status !== "CANCELLED",
        );
      case "past":
        return bookings.filter(
          (b) => new Date(b.showDateTime) <= now || b.status === "CANCELLED",
        );
      default:
        return bookings;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "EXPIRED":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const canCancelBooking = (booking) => {
    const showTime = new Date(booking.showDateTime);
    const now = new Date();
    const hoursUntilShow = (showTime - now) / (1000 * 60 * 60);

    return booking.status === "CONFIRMED" && hoursUntilShow > 2;
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Booking History</h2>
        <div className="flex gap-2">
          {["all", "upcoming", "past"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                filter === f
                  ? "bg-primary hover:bg-primary-dull text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-gray-400"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <Ticket className="w-20 h-20 text-gray-600 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            No Bookings Yet
          </h3>
          <p className="text-gray-400 text-center max-w-md">
            {filter === "all"
              ? "You haven't made any bookings yet. Start exploring movies!"
              : `No ${filter} bookings found.`}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 
                       hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Movie Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {booking.movieTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="font-mono">#{booking.orderId}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Date
                      </p>
                      <p className="text-sm text-white font-medium">
                        {formatDate(booking.showDateTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Time
                      </p>
                      <p className="text-sm text-white font-medium">
                        {formatTime(booking.showDateTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Ticket className="w-3 h-3" />
                        Seats
                      </p>
                      <p className="text-sm text-white font-medium">
                        {booking.bookingDetails
                          ?.map((d) => d.seatNumber)
                          .join(", ") || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-sm text-primary font-bold">
                        {currency}
                        {(booking.totalPrice / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>Payment: {booking.paymentMethod}</span>
                    <span>•</span>
                    <span>Booked: {formatDate(booking.bookingDate)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {canCancelBooking(booking) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 
                                 text-red-400 rounded-lg transition-colors text-sm disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Cancel Booking
                          </>
                        )}
                      </motion.button>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 
                                 text-primary rounded-lg transition-colors text-sm"
                      >
                        <Ticket className="w-4 h-4" />
                        View Ticket
                      </motion.button>
                    )}
                  </div>

                  {/* Cancel Warning */}
                  {canCancelBooking(booking) && (
                    <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-400">
                        You can cancel this booking up to 2 hours before the
                        show time.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default BookingHistory;
