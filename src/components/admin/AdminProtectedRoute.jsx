import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAdminInfo } from "../../service/admin/AuthService";
import { toast } from "react-hot-toast";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userInfo = await getAdminInfo();
      const roles = userInfo.roles?.map((role) => role.name) || [];

      if (roles.includes("ADMIN")) {
        setIsAdmin(true);
      } else {
        toast.error("Access denied. Admin privileges required.");
        localStorage.removeItem("ACCESS_TOKEN");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("ACCESS_TOKEN");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
