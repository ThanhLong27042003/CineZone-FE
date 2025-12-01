import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { http } from "../../utils/baseUrl";
import confetti from "canvas-confetti";

const VNPayCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = {};
        for (const [key, value] of searchParams.entries()) {
          params[key] = value;
        }

        console.log("VNPay callback params:", params);

        if (Object.keys(params).length === 0) {
          setStatus("failed");
          setErrorMessage("No payment data received");
          return;
        }

        const { data } = await http.get("/payment/vnpay-callback", { params });

        if (data.result && data.result.success) {
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
          setErrorMessage(
            data.result?.message || "Payment verification failed"
          );
        }
      } catch (err) {
        console.error("VNPay verification error:", err);
        setStatus("failed");
        setErrorMessage(
          err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred"
        );
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
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Đang xác nhận thanh toán VNPay
            </h2>
            <p className="text-gray-400">Vui lòng đợi...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Thanh toán thành công! 🎉
            </h2>
            <p className="text-gray-400 mb-4">
              Đặt vé của bạn đã được xác nhận
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-400">
                Email xác nhận sẽ được gửi trong giây lát
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Chuyển hướng trong 3 giây...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Thanh toán thất bại
            </h2>
            <p className="text-gray-400 mb-4">
              {errorMessage || "Có lỗi xảy ra với giao dịch của bạn"}
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
                Thử lại
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dull text-white rounded-lg transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VNPayCallback;
