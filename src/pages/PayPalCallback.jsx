import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { http } from "../../utils/baseUrl";
import confetti from "canvas-confetti";

const PayPalCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // PayPal trả về token và PayerID
        const token = searchParams.get("token");
        const payerId = searchParams.get("PayerID");

        console.log("PayPal callback - Token:", token, "PayerID:", payerId);

        if (!token) {
          setStatus("failed");
          setErrorMessage("No payment token received");
          return;
        }

        // Call backend để capture payment
        const { data } = await http.get("/payment/paypal-callback", {
          params: { token, PayerID: payerId },
        });

        console.log("PayPal verification response:", data);

        if (data.result && data.result.success) {
          setStatus("success");

          // 🎉 Confetti celebration
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#FFC439", "#0070BA", "#003087"], // PayPal colors
          });

          // Auto redirect after 3 seconds
          setTimeout(() => {
            navigate("/my-bookings");
          }, 3000);
        } else {
          setStatus("failed");
          setErrorMessage(data.result?.message || "Payment capture failed");
        }
      } catch (err) {
        console.error("PayPal verification error:", err);
        setStatus("failed");

        if (err.response?.data?.message) {
          setErrorMessage(err.response.data.message);
        } else if (err.message) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("An unexpected error occurred");
        }
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
        {/* Processing State */}
        {status === "processing" && (
          <>
            <Loader2 className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Processing PayPal Payment
            </h2>
            <p className="text-gray-400">Verifying your transaction...</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-150" />
            </div>
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Successful! 🎉
            </h2>
            <p className="text-gray-400 mb-4">
              Your booking has been confirmed
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-400">
                A confirmation email has been sent to your PayPal email
              </p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <p className="text-xs text-yellow-400">
                Transaction ID will be available in your booking history
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to your bookings in 3 seconds...
            </p>
          </>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-400 mb-4">
              {errorMessage || "Something went wrong with your PayPal payment"}
            </p>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PayPalCallback;
