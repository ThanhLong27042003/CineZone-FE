import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    // Load dark mode from localStorage
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Mock notifications - replace with real data from backend
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New booking received",
      time: "2 min ago",
      read: false,
      type: "booking",
      link: "/admin/list-bookings",
    },
    {
      id: 2,
      text: "Show added successfully",
      time: "15 min ago",
      read: false,
      type: "show",
      link: "/admin/list-shows",
    },
    {
      id: 3,
      text: "Payment confirmed",
      time: "1 hour ago",
      read: true,
      type: "payment",
      link: "/admin/list-bookings",
    },
    {
      id: 4,
      text: "New user registered",
      time: "2 hours ago",
      read: true,
      type: "user",
      link: "/admin/list-users",
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDark);
  }, [isDark]);

  // Mock search function - replace with real API call
  useEffect(() => {
    if (searchTerm.trim()) {
      // Simulate API delay
      const timer = setTimeout(() => {
        const mockResults = [
          {
            type: "movie",
            name: "Avengers: Endgame",
            id: 1,
            path: "/admin/list-movies",
          },
          {
            type: "show",
            name: "Show #123 - Avengers",
            id: 2,
            path: "/admin/list-shows",
          },
          {
            type: "user",
            name: "john@example.com",
            id: 3,
            path: "/admin/list-users",
          },
          {
            type: "booking",
            name: "Booking #456",
            id: 4,
            path: "/admin/list-bookings",
          },
        ].filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setSearchResults(mockResults);
        setShowSearchResults(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
    // Navigate to relevant page
    navigate(notification.link);
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return "🎫";
      case "show":
        return "🎬";
      case "payment":
        return "💳";
      case "user":
        return "👤";
      default:
        return "📢";
    }
  };

  const getSearchIcon = (type) => {
    switch (type) {
      case "movie":
        return "🎬";
      case "show":
        return "📅";
      case "user":
        return "👤";
      case "booking":
        return "🎫";
      default:
        return "🔍";
    }
  };

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
              placeholder="Search movies, shows, users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setShowSearchResults(true)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 
                       border-2 border-transparent focus:border-purple-500 
                       transition-all duration-300 outline-none text-gray-900 dark:text-white"
            />

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 
                           rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700
                           max-h-96 overflow-y-auto z-50"
                >
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        navigate(result.path);
                        setShowSearchResults(false);
                        setSearchTerm("");
                      }}
                      className="p-4 hover:bg-purple-50 dark:hover:bg-gray-700 cursor-pointer 
                               transition-colors border-b dark:border-gray-700 last:border-b-0
                               flex items-center gap-3"
                    >
                      <span className="text-2xl">
                        {getSearchIcon(result.type)}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {result.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {result.type}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Click outside to close */}
            {showSearchResults && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSearchResults(false)}
              />
            )}
          </motion.div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-6">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleThemeToggle}
              className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white
                       shadow-lg hover:shadow-xl transition-all"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
                <FaBell
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                             text-white text-xs flex items-center justify-center 
                             font-bold animate-pulse"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 
                               rounded-2xl shadow-2xl overflow-hidden z-50
                               border border-gray-200 dark:border-gray-700"
                    >
                      {/* Header */}
                      <div
                        className="p-4 border-b dark:border-gray-700 flex justify-between items-center
                                    bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        <h3 className="font-bold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-white/80 hover:text-white transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif, index) => (
                            <motion.div
                              key={notif.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleNotificationClick(notif)}
                              className={`p-4 border-b dark:border-gray-700 
                                       hover:bg-purple-50 dark:hover:bg-gray-700 
                                       cursor-pointer transition-colors flex gap-3
                                       ${!notif.read ? "bg-purple-50/50 dark:bg-gray-700/50" : ""}`}
                            >
                              <span className="text-2xl">
                                {getNotificationIcon(notif.type)}
                              </span>
                              <div className="flex-1">
                                <p
                                  className={`font-medium ${!notif.read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                                >
                                  {notif.text}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                  {notif.time}
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                              )}
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <FaBell className="text-4xl mx-auto mb-2 opacity-50" />
                            <p>No notifications</p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r 
                       from-purple-500 to-pink-500 cursor-pointer shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/admin")}
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
