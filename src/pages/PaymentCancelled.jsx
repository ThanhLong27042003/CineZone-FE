import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, Home, ArrowLeft } from "lucide-react";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center"
      >
        <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />

        <h2 className="text-2xl font-bold text-white mb-2">
          Payment Cancelled
        </h2>

        <p className="text-gray-400 mb-6">
          You have cancelled the payment process. No charges have been made.
        </p>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-400">
            Your selected seats are still held for a limited time. You can try
            again or choose different seats.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dull text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelled;
