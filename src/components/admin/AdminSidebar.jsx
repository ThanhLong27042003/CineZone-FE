import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFilm,
  FaList,
  FaTicketAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaDoorOpen,
  FaTags,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { adminLogout } from "../../service/admin/AuthService";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: "/admin",
      icon: FaHome,
      label: "Dashboard",
    },
    {
      path: "/admin/list-shows",
      icon: FaList,
      label: "Shows",
    },
    {
      path: "/admin/list-bookings",
      icon: FaTicketAlt,
      label: "Bookings",
    },
    {
      path: "/admin/list-movies",
      icon: FaFilm,
      label: "Movies",
    },
    {
      path: "/admin/list-genres",
      icon: FaTags,
      label: "Genres",
    },
    {
      path: "/admin/list-casts",
      icon: FaUser,
      label: "Casts",
    },
    {
      path: "/admin/list-rooms",
      icon: FaDoorOpen,
      label: "Rooms",
    },
    {
      path: "/admin/list-users",
      icon: FaUser,
      label: "Users",
    },
  ];

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        const myInfo = localStorage.getItem("myInfo");
        let userName = "admin";

        if (myInfo) {
          try {
            const userInfo = JSON.parse(myInfo);
            userName = userInfo.userName || "admin";
          } catch (e) {
            console.error("Error parsing myInfo:", e);
          }
        }

        await adminLogout({
          userName: userName,
          passWord: "",
        });

        toast.success("Logged out successfully");
        navigate("/admin/login");
      } catch (error) {
        console.error("Logout error:", error);
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("myInfo");
        toast.success("Logged out successfully");
        navigate("/admin/login");
      }
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-lg bg-gray-900 text-white shadow-lg"
      >
        {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white z-40 transition-all duration-300 overflow-hidden
                   ${isCollapsed ? "w-20" : "w-64"} 
                   shadow-xl border-r border-gray-800`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white text-gray-900 flex items-center justify-center">
              <FaFilm size={24} />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold text-white">CineZone</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-gray-900 font-semibold"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
          >
            <FaSignOutAlt size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
