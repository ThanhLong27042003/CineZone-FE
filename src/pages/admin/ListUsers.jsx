import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsers,
  setUsersLoading,
  setUsersError,
} from "../../redux/reducer/AdminReducer";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { lockUser, getAllUsersForAdmin, getUserById } from "../../service/admin/UserService";
import {
  FaUser,
  FaSearch,
  FaEye,
  FaLock,
  FaUnlock,
  FaTimes,
} from "react-icons/fa";

const ListUsers = () => {
  const dispatch = useDispatch();
  const {
    data: users = [],
    loading,
    currentPage,
    totalPages,
  } = useSelector((state) => state.admin.users || {});

  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      dispatch(setUsersLoading(true));
      const response = await getAllUsersForAdmin(page, 10);
      dispatch(setUsers(response));
    } catch (error) {
      dispatch(setUsersError(error?.response?.data?.message));
      toast.error(error?.response?.data?.message);
    }
  };

  const handleLock = async (userId) => {
    const user = users.find(u => u.id === userId);
    const action = user?.lock ? "unlock" : "lock";
    
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) {
      return;
    }
    
    try {
      const res = await lockUser(userId);
      toast.success(res);
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleViewDetail = async (userId) => {
    try {
      setDetailLoading(true);
      const userDetail = await getUserById(userId);
      setShowDetailModal(userDetail);
    } catch (error) {
      toast.error("Failed to fetch user details");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Title text1="User" text2="Management" icon={FaUser} />

      {/* Search Bar - Removed Add New User button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white
                     border-2 border-gray-200 focus:border-gray-400 
                     transition-all outline-none shadow-md text-gray-900"
          />
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> For security reasons, admin can only view user information and lock/unlock accounts. 
          User information changes must be done by the users themselves.
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Username</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Roles</th>
                  <th className="px-6 py-4 text-left font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{user.userName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{user.emailAddress}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <span
                            key={role.name}
                            className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium text-xs"
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{user.phoneNumber || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.lock
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-green-100 text-green-700 border border-green-300"
                        }`}
                      >
                        {user.lock ? "🔒 Locked" : "✓ Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetail(user.id)}
                          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        
                        {/* Lock/Unlock Button */}
                        <button
                          onClick={() => handleLock(user.id)}
                          className={`p-2 rounded-lg text-white transition-colors ${
                            user.lock 
                              ? "bg-green-600 hover:bg-green-700" 
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                          title={user.lock ? "Unlock Account" : "Lock Account"}
                        >
                          {user.lock ? <FaUnlock /> : <FaLock />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 rounded-lg bg-white border-2 border-gray-200
                     text-gray-700 font-medium disabled:opacity-50 
                     disabled:cursor-not-allowed hover:border-gray-400 
                     transition-all shadow-md"
          >
            Previous
          </button>

          <div className="px-6 py-3 rounded-lg bg-gray-900 text-white font-bold shadow-md">
            Page {page + 1} of {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-6 py-3 rounded-lg bg-white border-2 border-gray-200
                     text-gray-700 font-medium disabled:opacity-50 
                     disabled:cursor-not-allowed hover:border-gray-400 
                     transition-all shadow-md"
          >
            Next
          </button>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowDetailModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* User Basic Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">Basic Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Username:</span>
                    <div className="font-medium text-gray-900">{showDetailModal.userName}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <div className="font-medium text-gray-900">{showDetailModal.emailAddress}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">First Name:</span>
                    <div className="font-medium text-gray-900">{showDetailModal.firstName || "N/A"}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Name:</span>
                    <div className="font-medium text-gray-900">{showDetailModal.lastName || "N/A"}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <div className="font-medium text-gray-900">{showDetailModal.phoneNumber || "N/A"}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Date of Birth:</span>
                    <div className="font-medium text-gray-900">{formatDate(showDetailModal.dob)}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Address:</span>
                    <div className="font-medium text-gray-900">{showDetailModal.address || "N/A"}</div>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {showDetailModal.roles?.map((role) => (
                    <span
                      key={role.name}
                      className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-medium text-sm"
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">Account Status</h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      showDetailModal.lock
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-green-100 text-green-700 border border-green-300"
                    }`}
                  >
                    {showDetailModal.lock ? "🔒 Account Locked" : "✓ Account Active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-6 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListUsers;
