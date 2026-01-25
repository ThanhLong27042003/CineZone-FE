import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Shield,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

import BlurCircle from "../components/BlurCircle";
import { authHttp, http } from "../../utils/baseUrl";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unbookedSeats, showId, totalPrice, userId } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const currency = import.meta.env.VITE_CURRENCY;

  useEffect(() => {
    if (!unbookedSeats || unbookedSeats.length === 0) {
      navigate("/");
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          toast.error("Payment session expired!");
          navigate(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [unbookedSeats, navigate]);

  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      icon: CreditCard,
      description: "Thanh toán qua VNPay",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: CreditCard,
      description: "Pay with PayPal",
      color: "from-yellow-400 to-yellow-500",
    },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const { data } = await authHttp.post("/payment/create", {
        showId,
        seatNumbers: unbookedSeats.map((seat) => seat.seatNumber),
        userId,
        amount: totalPrice,
        paymentMethod,
      });

      if (data.result.paymentUrl) {
        window.location.href = data.result.paymentUrl;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed!");
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!unbookedSeats) return null;

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 pb-16">
      <BlurCircle top="100px" left="10%" />
      <BlurCircle top="400px" right="10%" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to seat selection
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Payment</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <Clock className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-mono font-semibold">
                {formatTime(countdown)}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Choose Payment Method
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`
                        p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/10"
                            : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                          w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} 
                          flex items-center justify-center
                        `}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">
                            {method.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {method.description}
                          </p>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                onClick={handlePayment}
                disabled={isProcessing}
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                className={`
                  w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all
                  ${
                    isProcessing
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-primary-dull hover:shadow-xl hover:shadow-primary/30"
                  }
                `}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Pay ${totalPrice}${currency}`
                )}
              </motion.button>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-semibold mb-1">
                    Secure Payment
                  </p>
                  <p className="text-sm text-gray-400">
                    Your payment information is encrypted and secure. We never
                    store your card details.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Selected Seats:</span>
                  <span className="text-white font-semibold">
                    {unbookedSeats.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {unbookedSeats.map((seat) => (
                    <span
                      key={seat.seatNumber}
                      className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-semibold"
                    >
                      {seat.seatNumber}
                    </span>
                  ))}
                </div>

                <div className="border-t border-zinc-700 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span>
                      {totalPrice}
                      {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Service Fee:</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">
                      {totalPrice}
                      {currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
