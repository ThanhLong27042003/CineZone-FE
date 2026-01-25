import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBookings,
  setBookingsLoading,
  setBookingsError,
  setBookingStatistics,
} from "../../redux/reducer/AdminReducer";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import {
  getAllBookingsForAdmin,
  cancelBooking,
  confirmBooking,
  getBookingStatistics,
} from "../../service/admin/BookingService";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTicketAlt,
  FaUser,
  FaCalendar,
  FaDollarSign,
  FaFilter,
  FaTimes,
  FaCheck,
  FaEye,
  FaSearch,
  FaClock,
} from "react-icons/fa";

const ListBookings = () => {
  const dispatch = useDispatch();
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const {
    data: bookings = [],
    loading,
    currentPage,
    totalPages,
    statistics,
  } = useSelector((state) => state.admin.bookings || {});

  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    userId: "",
    showId: "",
    status: "",
    fromDate: "",
    toDate: "",
  });
  const [showDetailModal, setShowDetailModal] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchStatistics();
  }, [page, filters]);

  const fetchBookings = async () => {
    try {
      dispatch(setBookingsLoading(true));
      const response = await getAllBookingsForAdmin(page, 10, filters);
      console.log("RESPONSE FROM API:", response);
      dispatch(setBookings(response));
    } catch (error) {
      dispatch(setBookingsError(error.message));
      toast.error("Failed to fetch bookings");
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getBookingStatistics(
        filters.fromDate || null,
        filters.toDate || null,
      );
      dispatch(setBookingStatistics(response));
    } catch (error) {
      console.error("Failed to fetch statistics", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0);
  };

  const resetFilters = () => {
    setFilters({
      userId: "",
      showId: "",
      status: "",
      fromDate: "",
      toDate: "",
    });
    setPage(0);
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(bookingId);
        toast.success("Booking cancelled successfully");
        fetchBookings();
        fetchStatistics();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to cancel booking",
        );
      }
    }
  };

  const handleConfirm = async (bookingId) => {
    if (window.confirm("Are you sure you want to confirm this booking?")) {
      try {
        await confirmBooking(bookingId);
        toast.success("Booking confirmed successfully");
        fetchBookings();
        fetchStatistics();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to confirm booking",
        );
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-300";
      case "PAYMENT_PROCESSING":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-300";
      case "EXPIRED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "✅ Đã xác nhận";
      case "PENDING":
        return "⏳ Đang chờ";
      case "PAYMENT_PROCESSING":
        return "💳 Đang thanh toán";
      case "CANCELLED":
        return "❌ Đã hủy";
      case "EXPIRED":
        return "⌛ Hết hạn";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Title text1="Booking" text2="Management" icon={FaTicketAlt} />

      {/* Statistics Cards */}
      {statistics && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {[
            {
              label: "Total Bookings",
              value: statistics.totalBookings || 0,
              icon: FaTicketAlt,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Total Revenue",
              value: `${currency}${(statistics.totalRevenue / 100 || 0).toFixed(
                2,
              )}`,
              icon: FaDollarSign,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Confirmed",
              value: statistics.confirmedBookings || 0,
              icon: FaCheck,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Pending",
              value: statistics.pendingBookings || 0,
              icon: FaCalendar,
              color: "from-orange-500 to-red-500",
            },
            {
              label: "Cancelled",
              value: statistics.cancelledBookings || 0,
              icon: FaTimes,
              color: "from-gray-500 to-gray-700",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-purple-500" />
          <h3 className="font-bold text-gray-800 dark:text-white">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="userId"
            value={filters.userId}
            onChange={handleFilterChange}
            placeholder="User ID"
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-700 
                     border-2 border-gray-200 dark:border-gray-600 
                     focus:border-purple-500 transition-all outline-none"
          />

          <input
            type="text"
            name="showId"
            value={filters.showId}
            onChange={handleFilterChange}
            placeholder="Show ID"
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-700 
                     border-2 border-gray-200 dark:border-gray-600 
                     focus:border-purple-500 transition-all outline-none"
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-700 
                     border-2 border-gray-200 dark:border-gray-600 
                     focus:border-purple-500 transition-all outline-none"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-700 
                     border-2 border-gray-200 dark:border-gray-600 
                     focus:border-purple-500 transition-all outline-none"
          />

          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-700 
                     border-2 border-gray-200 dark:border-gray-600 
                     focus:border-purple-500 transition-all outline-none"
          />
        </div>

        <div className="mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            className="px-6 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Reset Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">User</th>
                  <th className="px-6 py-4 text-left font-semibold">Movie</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Booking Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Show Time
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700
                       hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">#{booking.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{booking.userName}</div>
                        <div className="text-sm text-gray-500">
                          {booking.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{booking.movieTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaClock className="text-blue-500" />
                        <span className="text-sm">
                          {formatDate(booking.bookingDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaCalendar className="text-purple-500" />
                        <span className="text-sm">
                          {formatDate(booking.showDateTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {currency}
                        {(booking.totalPrice / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDetailModal(booking)}
                          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                          title="View Details"
                        >
                          <FaEye />
                        </motion.button>

                        {booking.status === "PENDING" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleConfirm(booking.id)}
                              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                              title="Confirm"
                            >
                              <FaCheck />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCancel(booking.id)}
                              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                              title="Cancel"
                            >
                              <FaTimes />
                            </motion.button>
                          </>
                        )}

                        {booking.status === "CONFIRMED" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCancel(booking.id)}
                            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            title="Cancel"
                          >
                            <FaTimes />
                          </motion.button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                      >
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaTicketAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No bookings found
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-purple-500 transition-all shadow-lg"
          >
            Previous
          </motion.button>

          <div
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
                        text-white font-bold shadow-lg"
          >
            Page {page + 1} of {totalPages}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-purple-500 transition-all shadow-lg"
          >
            Next
          </motion.button>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Booking Details
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailModal(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FaTimes size={24} />
                </motion.button>
              </div>

              <div className="space-y-4">
                {/* Booking Information - MỚI THÊM */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    Booking Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Booking ID:</span>
                      <div className="font-medium font-mono">
                        #{showDetailModal.id}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Booking Date:</span>
                      <div className="font-medium">
                        {formatDate(showDetailModal.bookingDate)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h4 className="font-semibold mb-3">Movie Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Title:</span>
                      <div className="font-medium">
                        {showDetailModal.movieTitle}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Show Time:</span>
                      <div className="font-medium">
                        {formatDate(showDetailModal.showDateTime)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <div className="font-medium">
                        {showDetailModal.userName}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <div className="font-medium">
                        {showDetailModal.userEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <h4 className="font-semibold mb-3">Payment Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Order ID:</span>
                      <div className="font-medium font-mono">
                        {showDetailModal.orderId}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Method:</span>
                      <div className="font-medium">
                        {showDetailModal.paymentMethod}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {currency}
                        {(showDetailModal.totalPrice / 100).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            showDetailModal.status,
                          )}`}
                        >
                          {showDetailModal.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListBookings;
