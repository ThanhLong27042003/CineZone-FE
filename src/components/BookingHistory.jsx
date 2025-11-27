import React from "react";
import { Ticket } from "lucide-react";

const BookingHistory = ({ bookingHistory }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Booking History</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary hover:bg-primary-dull rounded-lg transition-colors text-sm">
            All
          </button>
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-400">
            Upcoming
          </button>
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-400">
            Past
          </button>
        </div>
      </div>

      {bookingHistory.map((booking) => (
        <div
          key={booking.id}
          className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={booking.poster}
              alt={booking.movieTitle}
              className="w-full md:w-24 h-36 object-cover rounded-lg"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {booking.movieTitle}
                  </h3>
                  <p className="text-gray-400 text-sm">{booking.theater}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm text-white font-medium">
                    {booking.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Time</p>
                  <p className="text-sm text-white font-medium">
                    {booking.time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Seats</p>
                  <p className="text-sm text-white font-medium">
                    {booking.seats}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="text-sm text-primary font-bold">
                    {booking.totalPrice}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm">
                  <Ticket className="w-4 h-4" />
                  View Ticket
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-colors text-sm">
                  Book Again
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
