import React from "react";
import { motion } from "framer-motion";

/**
 * ✅ THAY ĐỔI: Tách UI ghế ra component riêng
 * - Giảm 50+ dòng code trong renderSeats
 * - Dễ customize từng ghế
 */
export const Seat = ({
  seatId,
  number,
  isSelected,
  isBooked,
  isHeldByOthers,
  isBookByOthers,
  countdown,
  onClick,
}) => {
  const isDisabled = isBooked || isHeldByOthers || isBookByOthers;

  return (
    <motion.button
      onClick={() => !isDisabled && onClick(seatId)}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.1 } : {}}
      whileTap={!isDisabled ? { scale: 0.9 } : {}}
      className={`
        relative h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-300
        ${
          isBooked
            ? "bg-green-600 text-white cursor-not-allowed"
            : isSelected
            ? "bg-gradient-to-br from-primary to-primary-dull text-white shadow-lg shadow-primary/30"
            : isBookByOthers
            ? "bg-green-600 text-white cursor-not-allowed brightness-40"
            : isHeldByOthers
            ? "bg-gradient-to-br from-primary to-primary-dull text-white cursor-not-allowed brightness-40"
            : "bg-gray-800/60 hover:bg-gray-700/80 border border-gray-600 hover:border-primary/50 text-gray-300 hover:text-white"
        }
      `}
    >
      {isSelected && countdown > 0 ? (
        <span className="text-[8px] font-bold">
          {Math.floor(countdown / 60)}:
          {(countdown % 60).toString().padStart(2, "0")}
        </span>
      ) : (
        number
      )}

      {(isHeldByOthers || isSelected || isBookByOthers || isBooked) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"
        />
      )}
    </motion.button>
  );
};
