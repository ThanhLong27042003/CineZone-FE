

import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const notifications = [
    { id: 1, text: "New booking received", time: "2 min ago" },
    { id: 2, text: "Show added successfully", time: "15 min ago" },
    { id: 3, text: "Payment confirmed", time: "1 hour ago" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 md:left-64 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative flex-1 max-w-md"
          >
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 
                       border-2 border-transparent focus:border-purple-500 
                       transition-all duration-300 outline-none"
            />
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-6">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            >
              {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 
                         hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaBell size={20} />
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                               text-white text-xs flex items-center justify-center 
                               animate-pulse"
                >
                  3
                </span>
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 
                             rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {notifications.map((notif, index) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 
                                 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <p className="font-medium">{notif.text}</p>
                        <p className="text-sm text-gray-500">{notif.time}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r 
                       from-purple-500 to-pink-500 cursor-pointer"
            >
              <FaUserCircle size={32} className="text-white" />
              <div className="text-white hidden lg:block">
                <p className="font-semibold text-sm">Admin</p>
                <p className="text-xs opacity-80">Administrator</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default AdminNavbar;
