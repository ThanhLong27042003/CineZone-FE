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
import {
  FaTicketAlt,
  FaUser,
  FaCalendar,
  FaDollarSign,
  FaFilter,
  FaTimes,
  FaCheck,
  FaEye,
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
    if (
      window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      )
    ) {
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
        return "bg-green-100 text-green-700 border border-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "PAYMENT_PROCESSING":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border border-red-300";
      case "EXPIRED":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "✅ Confirmed";
      case "PENDING":
        return "⏳ Pending";
      case "PAYMENT_PROCESSING":
        return "💳 Processing";
      case "CANCELLED":
        return "❌ Cancelled";
      case "EXPIRED":
        return "⌛ Expired";
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

      {/* Info Notice - Booking cannot be deleted */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Bookings cannot be deleted to maintain
          transaction records. You can only confirm pending bookings or cancel
          them if needed.
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              label: "Total Bookings",
              value: statistics.totalBookings || 0,
              icon: FaTicketAlt,
              bgColor: "bg-blue-50",
              iconColor: "text-blue-600",
            },
            {
              label: "Total Revenue",
              value: `${currency}${(statistics.totalRevenue / 100 || 0).toFixed(2)}`,
              icon: FaDollarSign,
              bgColor: "bg-green-50",
              iconColor: "text-green-600",
            },
            {
              label: "Confirmed",
              value: statistics.confirmedBookings || 0,
              icon: FaCheck,
              bgColor: "bg-gray-50",
              iconColor: "text-gray-600",
            },
            {
              label: "Pending",
              value: statistics.pendingBookings || 0,
              icon: FaCalendar,
              bgColor: "bg-yellow-50",
              iconColor: "text-yellow-600",
            },
            {
              label: "Cancelled",
              value: statistics.cancelledBookings || 0,
              icon: FaTimes,
              bgColor: "bg-red-50",
              iconColor: "text-red-600",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-4 shadow-md border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`text-xl ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-600" />
          <h3 className="font-bold text-gray-800">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="userId"
            value={filters.userId}
            onChange={handleFilterChange}
            placeholder="User ID"
            className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                     focus:border-gray-400 transition-all outline-none placeholder-black"
          />

          <input
            type="text"
            name="showId"
            value={filters.showId}
            onChange={handleFilterChange}
            placeholder="Show ID"
            className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                     focus:border-gray-400 transition-all outline-none placeholder-black"
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                     focus:border-gray-400 transition-all outline-none text-black"
          >
            <option value="" style={{ color: "#000" }}>
              All Status
            </option>
            <option value="PENDING" style={{ color: "#000" }}>
              Pending
            </option>
            <option value="CONFIRMED" style={{ color: "#000" }}>
              Confirmed
            </option>
            <option value="CANCELLED" style={{ color: "#000" }}>
              Cancelled
            </option>
          </select>

          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                     focus:border-gray-400 transition-all outline-none text-black"
          />

          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                     focus:border-gray-400 transition-all outline-none text-black"
          />
        </div>

        <div className="mt-4">
          <button
            onClick={resetFilters}
            className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 
                     font-medium hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
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
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">#{booking.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {booking.movieTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-gray-500" />
                        <span className="text-sm">
                          {formatDate(booking.bookingDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendar className="text-gray-500" />
                        <span className="text-sm">
                          {formatDate(booking.showDateTime)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600">
                        {currency}
                        {(booking.totalPrice / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                      >
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDetailModal(booking)}
                          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>

                        {booking.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleConfirm(booking.id)}
                              className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                              title="Confirm"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleCancel(booking.id)}
                              className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}

                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No bookings found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 rounded-lg bg-white border-2 border-gray-200
                     text-gray-700 font-medium disabled:opacity-50 
                     disabled:cursor-not-allowed hover:border-gray-400 
                     transition-all shadow-md"
          >
            Previous
          </button>

          <div className="px-6 py-3 rounded-lg bg-gray-900 text-white font-bold shadow-md">
            Page {page + 1} of {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-6 py-3 rounded-lg bg-white border-2 border-gray-200
                     text-gray-700 font-medium disabled:opacity-50 
                     disabled:cursor-not-allowed hover:border-gray-400 
                     transition-all shadow-md"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => setShowDetailModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Booking Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <FaClock className="text-gray-600" />
                  Booking Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Booking ID:</span>
                    <div className="font-medium font-mono text-gray-900">
                      #{showDetailModal.id}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Booking Date:</span>
                    <div className="font-medium text-gray-900">
                      {formatDate(showDetailModal.bookingDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">
                  Movie Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Title:</span>
                    <div className="font-medium text-gray-900">
                      {showDetailModal.movieTitle}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Show Time:</span>
                    <div className="font-medium text-gray-900">
                      {formatDate(showDetailModal.showDateTime)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <div className="font-medium text-gray-900">
                      {showDetailModal.userName}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <div className="font-medium text-gray-900">
                      {showDetailModal.userEmail}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Order ID:</span>
                    <div className="font-medium font-mono text-gray-900">
                      {showDetailModal.orderId}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Method:</span>
                    <div className="font-medium text-gray-900">
                      {showDetailModal.paymentMethod}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <div className="font-bold text-green-600">
                      {currency}
                      {(showDetailModal.totalPrice / 100).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(showDetailModal.status)}`}
                      >
                        {getStatusLabel(showDetailModal.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-6 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBookings;
