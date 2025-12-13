import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { createUser } from "../../service/admin/UserService";
import { getAllRole } from "../../service/admin/RoleService";
import { motion } from "framer-motion";
import { FaUser, FaSave, FaTimes } from "react-icons/fa";

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    emailAddress: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    dob: "",
    roles: [],
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getAllRole();
      setRoles(response);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (roleName) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(formData);
      toast.success("User created successfully");
      navigate("/admin/list-users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Title text1="Create" text2="User" icon={FaUser} />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="Enter username (min 3 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="Enter password (min 8 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="Doe"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="123 Main St, City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Roles
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {roles.map((role) => (
              <motion.label
                key={role.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all
                  ${
                    formData.roles.includes(role.name)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role.name)}
                  onChange={() => handleRoleChange(role.name)}
                  className="hidden"
                />
                <span className="text-sm font-medium">{role.name}</span>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/list-users")}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700
                     flex items-center gap-2 transition-all"
          >
            <FaTimes /> Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white font-medium shadow-lg hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2 transition-all"
          >
            <FaSave />
            {loading ? "Creating..." : "Create User"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default CreateUser;
