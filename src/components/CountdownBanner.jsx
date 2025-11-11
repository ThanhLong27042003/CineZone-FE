import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, CreditCardIcon } from "lucide-react";


export const CountdownBanner = ({
  seatCountdowns,
  selectedSeatsCount,
  onPayment,
}) => {
  if (Object.keys(seatCountdowns).length === 0) return null;

  const now = Date.now();
  const minExpiry = Math.min(...Object.values(seatCountdowns));
  const countdown = Math.max(0, Math.floor((minExpiry - now) / 1000));

  if (countdown === 0) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div
          className={`
            px-8 py-4 rounded-2xl backdrop-blur-xl border-2 shadow-2xl
            ${
              countdown <= 30
                ? "bg-red-500/20 border-red-500 animate-pulse"
                : "bg-primary/20 border-primary"
            }
          `}
        >
          <div className="flex items-center gap-6">
            {" "}
            <div className="flex items-center gap-4">
              <ClockIcon
                className={`w-6 h-6 ${
                  countdown <= 30 ? "text-red-400" : "text-primary"
                }`}
              />
              <div>
                <p className="text-white font-semibold text-lg">
                  Thời gian còn lại:{" "}
                  <span className="text-2xl font-bold">
                    {formatTime(countdown)}
                  </span>
                </p>
                <p className="text-gray-300 text-sm">
                  {selectedSeatsCount} ghế đang giữ - Vui lòng hoàn tất thanh
                  toán
                </p>
              </div>
            </div>
            <motion.button
              onClick={onPayment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  countdown <= 30
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/50"
                }
                `}
            >
              <CreditCardIcon className="w-5 h-5" />
              Thanh toán ngay
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
