import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { http } from "../../utils/baseUrl";
import confetti from "canvas-confetti";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const { data } = await http.post("/payment/callback", params);

        if (data.result.success) {
          setStatus("success");
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          setTimeout(() => {
            navigate("/my-bookings");
          }, 3000);
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center"
      >
        {status === "processing" && (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-400">Please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-400 mb-4">
              Your booking has been confirmed
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your bookings...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-400 mb-6">
              Something went wrong with your payment
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary hover:bg-primary-dull rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallback;
