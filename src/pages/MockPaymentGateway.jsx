import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const MockPaymentGateway = () => {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const returnUrl = searchParams.get("returnUrl");
  const showId = searchParams.get("showId");
  const userId = searchParams.get("userId");
  const seats = searchParams.get("seats");
  const paymentMethod = searchParams.get("paymentMethod");

  const handlePayment = (success) => {
    const params = new URLSearchParams({
      orderId,
      status: success ? "success" : "failed",
      amount,
      showId,
      userId,
      seats,
      paymentMethod,
    });

    window.location.href = `${returnUrl}?${params.toString()}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handlePayment(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Mock Payment Gateway
          </h1>
          <p className="text-gray-600 mb-6">VNPay Sandbox</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm">
                {orderId?.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Seats:</span>
              <span className="font-semibold">{seats}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-xl text-blue-600">
                {parseInt(amount).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Auto-confirming in {countdown} seconds...
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => handlePayment(true)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              ✓ Confirm Payment
            </button>
            <button
              onClick={() => handlePayment(false)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              ✗ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentGateway;
