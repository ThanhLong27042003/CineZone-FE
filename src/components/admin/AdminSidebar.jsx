// import React from "react";
// import { assets } from "../../assets/assets";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboardIcon,
//   ListCollapseIcon,
//   ListIcon,
//   PlusSquareIcon,
// } from "lucide-react";

// const AdminSidebar = () => {
//   const user = {
//     firstName: "admin",
//     lastName: "User",
//     imageUrl: assets.profile,
//   };

//   const adminNavlinks = [
//     {
//       name: "DashBoard",
//       path: "/admin",
//       icon: LayoutDashboardIcon,
//     },
//     {
//       name: "Add Shows",
//       path: "/admin/add-shows",
//       icon: PlusSquareIcon,
//     },
//     {
//       name: "List Shows",
//       path: "/admin/list-shows",
//       icon: ListIcon,
//     },
//     {
//       name: "List Bookings",
//       path: "/admin/list-bookings",
//       icon: ListCollapseIcon,
//     },
//   ];
//   return (
//     <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
//       <img
//         className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
//         src={user.imageUrl}
//         alt="sidebar"
//       />
//       <p className="mt-2 text-base max-md:hidden">
//         {user.firstName} {user.lastName}
//       </p>
//       <div className="w-full">
//         {adminNavlinks.map((link, index) => (
//           <NavLink
//             key={index}
//             to={link.path}
//             end
//             className={({ isActive }) =>
//               `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${
//                 isActive && "bg-primary/15 text-primary group"
//               }`
//             }
//           >
//             {({ isActive }) => (
//               <>
//                 <link.icon className="w-5 h-5" />
//                 <p className="max-md:hidden">{link.name}</p>
//                 <span
//                   className={`w-1.5 h-10 rounded-l right-0 absolute ${
//                     isActive && "bg-primary"
//                   }`}
//                 />
//               </>
//             )}
//           </NavLink>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaFilm,
  FaList,
  FaTicketAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: "/admin",
      icon: FaHome,
      label: "Dashboard",
      color: "from-blue-500 to-cyan-500",
    },
    {
      path: "/admin/add-shows",
      icon: FaFilm,
      label: "Add Shows",
      color: "from-purple-500 to-pink-500",
    },
    {
      path: "/admin/list-shows",
      icon: FaList,
      label: "List Shows",
      color: "from-green-500 to-emerald-500",
    },
    {
      path: "/admin/list-bookings",
      icon: FaTicketAlt,
      label: "Bookings",
      color: "from-orange-500 to-red-500",
    },
    {
      path: "/admin/analytics",
      icon: FaChartBar,
      label: "Analytics",
      color: "from-yellow-500 to-orange-500",
    },
    {
      path: "/admin/settings",
      icon: FaCog,
      label: "Settings",
      color: "from-gray-500 to-gray-700",
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-xl 
                 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
      >
        {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 
                   text-white z-40 transition-all duration-500 overflow-hidden
                   ${isCollapsed ? "w-20" : "w-64"} 
                   shadow-2xl border-r border-purple-500/20`}
      >
        {/* Logo Section */}
        <motion.div
          className="p-6 border-b border-purple-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 
                       flex items-center justify-center"
            >
              <FaFilm size={24} />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1
                    className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
                               bg-clip-text text-transparent"
                  >
                    CineZone
                  </h1>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group
                ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} shadow-lg scale-105`
                    : "hover:bg-white/10 hover:scale-105"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    <item.icon size={22} />
                  </motion.div>

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={`font-medium ${
                          isActive ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-500/20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center gap-4 p-3 rounded-xl 
                     bg-gradient-to-r from-red-500 to-pink-500 
                     hover:from-red-600 hover:to-pink-600 transition-all"
          >
            <FaSignOutAlt size={22} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
