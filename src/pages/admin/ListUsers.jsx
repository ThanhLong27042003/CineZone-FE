import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsers,
  setUsersLoading,
  setUsersError,
} from "../../redux/reducer/AdminReducer";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { lockUser, getAllUsersForAdmin } from "../../service/admin/UserService";
import { motion } from "framer-motion";
import {
  FaUser,
  FaSearch,
  FaEdit,
  FaLock,
  FaUnlock,
  FaPlus,
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
    try {
      const res = await lockUser(userId);
      toast.success(res);
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Title text1="User" text2="Management" icon={FaUser} />

      {/* Search and Add Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800
                     border-2 border-gray-200 dark:border-gray-700
                     focus:border-purple-500 transition-all outline-none shadow-lg
                     text-gray-900 dark:text-white"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/admin/create-user")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
                   text-white font-medium shadow-lg hover:shadow-xl transition-all
                   flex items-center gap-2 justify-center whitespace-nowrap"
        >
          <FaPlus /> Add New User
        </motion.button>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Roles</th>
                  <th className="px-6 py-4 text-left font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700
                             hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium">{user.userName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 dark:text-gray-300">
                        {user.emailAddress}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <span
                            key={role.name}
                            className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30
                                     text-blue-700 dark:text-blue-300 font-medium text-xs"
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 dark:text-gray-300">
                        {user.phoneNumber || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            (window.location.href = `/admin/edit-user/${user.id}`)
                          }
                          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLock(user.id)}
                          className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                          title={user.lock ? "lock" : "unlock"}
                        >
                          {user.lock ? <FaLock /> : <FaUnlock />}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No users found
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-purple-500 transition-all shadow-lg"
          >
            Previous
          </motion.button>

          <div
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
                        text-white font-bold shadow-lg"
          >
            Page {page + 1} of {totalPages}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-purple-500 transition-all shadow-lg"
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ListUsers;
