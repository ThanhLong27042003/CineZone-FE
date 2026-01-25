import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DateFilter = ({ onDateSelect, selectedDate, availableDates = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(0);

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const allDates = generateDates();
  const datesPerPage = 7;
  const visibleDates = allDates.slice(
    currentWeekStart,
    currentWeekStart + datesPerPage,
  );

  const handlePrevWeek = () => {
    if (currentWeekStart > 0) {
      setCurrentWeekStart(currentWeekStart - datesPerPage);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekStart + datesPerPage < allDates.length) {
      setCurrentWeekStart(currentWeekStart + datesPerPage);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const isDateAvailable = (date) => {
    const dateStr = formatDate(date);
    return availableDates.includes(dateStr);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return formatDate(date) === selectedDate;
  };

  const getDayName = (date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg hover:bg-primary/30 transition text-white"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Chọn ngày"}
        </span>
      </motion.button>

      {/* Date Picker Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl p-6 shadow-2xl z-50 w-full max-w-2xl border border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Chọn ngày xem phim
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Date Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevWeek}
                  disabled={currentWeekStart === 0}
                  className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <div className="grid grid-cols-7 gap-2 flex-1 mx-4">
                  {visibleDates.map((date, index) => {
                    const available = isDateAvailable(date);
                    const today = isToday(date);
                    const selected = isSelected(date);

                    return (
                      <motion.button
                        key={index}
                        whileHover={available ? { scale: 1.05 } : {}}
                        whileTap={available ? { scale: 0.95 } : {}}
                        onClick={() => {
                          if (available) {
                            onDateSelect(formatDate(date));
                            setIsOpen(false);
                          }
                        }}
                        disabled={!available}
                        className={`
                          relative p-3 rounded-lg border transition
                          ${
                            selected
                              ? "bg-primary border-primary text-white"
                              : available
                                ? "bg-gray-800 border-gray-700 hover:border-primary text-white"
                                : "bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed opacity-50"
                          }
                        `}
                      >
                        <div className="text-xs font-medium mb-1">
                          {getDayName(date)}
                        </div>
                        <div className="text-lg font-bold">
                          {date.getDate()}
                        </div>
                        <div className="text-xs text-gray-400">
                          Th{date.getMonth() + 1}
                        </div>

                        {today && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                        )}

                        {available && !selected && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextWeek}
                  disabled={currentWeekStart + datesPerPage >= allDates.length}
                  className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-800 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Có suất chiếu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Hôm nay</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    onDateSelect(null);
                    setIsOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateFilter;
