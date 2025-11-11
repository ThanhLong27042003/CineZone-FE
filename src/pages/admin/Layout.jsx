// import React from "react";
// import AdminNavbar from "../../components/admin/AdminNavbar";
// import AdminSidebar from "../../components/admin/AdminSidebar";
// import { Outlet } from "react-router-dom";

// const Layout = () => {
//   return (
//     <>
//       <AdminNavbar />
//       <div className="flex">
//         <AdminSidebar />
//         <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Layout;

import React from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 px-4 py-20 md:px-10 md:ml-64 min-h-screen overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
