import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 md:left-64 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-white/95"
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-end">
          {/* Right Section */}
          <div className="flex items-center gap-4">
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

