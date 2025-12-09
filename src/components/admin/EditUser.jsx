import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { getUserById, updateUser } from "../../service/admin/UserService";

const EditUser = () => {
  //   const { userId } = useParams();
  //   const navigate = useNavigate();
  //   const [formData, setFormData] = useState({
  //     username: "",
  //     email: "",
  //     firstName: "",
  //     lastName: "",
  //     phoneNumber: "",
  //     roles: [],
  //   });
  //   const [roles, setRoles] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   const [fetchLoading, setFetchLoading] = useState(true);
  //   useEffect(() => {
  //     fetchData();
  //   }, [userId]);
  //   const fetchData = async () => {
  //     try {
  //       const [userResponse, rolesResponse] = await Promise.all([
  //         getUserById(userId),
  //         getAllRoles(),
  //       ]);
  //       const user = userResponse.result;
  //       setFormData({
  //         username: user.username || "",
  //         email: user.email || "",
  //         firstName: user.firstName || "",
  //         lastName: user.lastName || "",
  //         phoneNumber: user.phoneNumber || "",
  //         roles: user.roles?.map((r) => r.name) || [],
  //       });
  //       setRoles(rolesResponse.result);
  //     } catch (error) {
  //       toast.error("Failed to fetch user data");
  //     } finally {
  //       setFetchLoading(false);
  //     }
  //   };
  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };
  //   const handleRoleChange = (roleId) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       roles: prev.roles.includes(roleId)
  //         ? prev.roles.filter((id) => id !== roleId)
  //         : [...prev.roles, roleId],
  //     }));
  //   };
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     try {
  //       await updateUser(userId, formData);
  //       toast.success("User updated successfully");
  //       navigate("/admin/users");
  //     } catch (error) {
  //       toast.error(error.response?.data?.message || "Failed to update user");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (fetchLoading) {
  //     return <div className="p-6 text-center">Loading...</div>;
  //   }
  //   return (
  //     <div className="p-6 max-w-4xl mx-auto">
  //       <Title title="Edit User" />
  //       <form
  //         onSubmit={handleSubmit}
  //         className="bg-white rounded-lg shadow-lg p-6 mt-6"
  //       >
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Username *
  //             </label>
  //             <input
  //               type="text"
  //               name="username"
  //               value={formData.username}
  //               onChange={handleChange}
  //               required
  //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Email *
  //             </label>
  //             <input
  //               type="email"
  //               name="email"
  //               value={formData.email}
  //               onChange={handleChange}
  //               required
  //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Phone Number
  //             </label>
  //             <input
  //               type="tel"
  //               name="phoneNumber"
  //               value={formData.phoneNumber}
  //               onChange={handleChange}
  //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               First Name
  //             </label>
  //             <input
  //               type="text"
  //               name="firstName"
  //               value={formData.firstName}
  //               onChange={handleChange}
  //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">
  //               Last Name
  //             </label>
  //             <input
  //               type="text"
  //               name="lastName"
  //               value={formData.lastName}
  //               onChange={handleChange}
  //               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             />
  //           </div>
  //         </div>
  //         <div className="mt-6">
  //           <label className="block text-sm font-medium text-gray-700 mb-2">
  //             Roles
  //           </label>
  //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  //             {roles.map((role) => (
  //               <label
  //                 key={role.name}
  //                 className="flex items-center space-x-2 cursor-pointer"
  //               >
  //                 <input
  //                   type="checkbox"
  //                   checked={formData.roles.includes(role.name)}
  //                   onChange={() => handleRoleChange(role.name)}
  //                   className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
  //                 />
  //                 <span className="text-sm text-gray-700">{role.name}</span>
  //               </label>
  //             ))}
  //           </div>
  //         </div>
  //         <div className="mt-8 flex justify-end space-x-4">
  //           <button
  //             type="button"
  //             onClick={() => navigate("/admin/users")}
  //             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             type="submit"
  //             disabled={loading}
  //             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
  //           >
  //             {loading ? "Updating..." : "Update User"}
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   );
};

export default EditUser;
