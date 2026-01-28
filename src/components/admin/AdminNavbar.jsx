import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [notifications] = useState([
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
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNotificationClick = (notification) => {
    navigate(notification.link);
    setShowNotifications(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav
      className={`fixed top-0 right-0 left-0 md:left-64 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-white/95"
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 
                       border-2 border-transparent focus:border-gray-400 
                       transition-all duration-200 outline-none text-gray-900"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-6">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FaBell size={20} className="text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full 
                             text-white text-xs flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200"
                  >
                    {/* Header */}
                    <div className="p-4 border-b bg-gray-900 text-white">
                      <h3 className="font-bold">Notifications</h3>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors
                                     ${!notif.read ? "bg-gray-50" : ""}`}
                          >
                            <p className={`font-medium ${!notif.read ? "text-gray-900" : "text-gray-600"}`}>
                              {notif.text}
                            </p>
                            <p className="text-sm text-gray-500">{notif.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <FaBell className="text-4xl mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                </>
              )}
            </div>

            {/* User Profile */}
            <div
              className="flex items-center gap-3 p-2 rounded-lg bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => navigate("/admin")}
            >
              <FaUserCircle size={32} className="text-white" />
              <div className="text-white hidden lg:block">
                <p className="font-semibold text-sm">Admin</p>
                <p className="text-xs opacity-80">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
