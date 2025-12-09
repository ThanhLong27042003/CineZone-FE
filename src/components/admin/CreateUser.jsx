import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { createUser } from "../../service/admin/UserService";

const CreateUser = () => {
  //   const navigate = useNavigate();
  //   const [formData, setFormData] = useState({
  //     username: "",
  //     email: "",
  //     password: "",
  //     firstName: "",
  //     lastName: "",
  //     phoneNumber: "",
  //     roles: [],
  //   });
  //   const [roles, setRoles] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   useEffect(() => {
  //     fetchRoles();
  //   }, []);
  //   const fetchRoles = async () => {
  //     try {
  //       const response = await getAllRoles();
  //       setRoles(response.result);
  //     } catch (error) {
  //       toast.error("Failed to fetch roles");
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
  //       await createUser(formData);
  //       toast.success("User created successfully");
  //       navigate("/admin/users");
  //     } catch (error) {
  //       toast.error(error.response?.data?.message || "Failed to create user");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   return (
  //     <div className="p-6 max-w-4xl mx-auto">
  //       <Title title="Create New User" />
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
  //               Password *
  //             </label>
  //             <input
  //               type="password"
  //               name="password"
  //               value={formData.password}
  //               onChange={handleChange}
  //               required
  //               minLength={8}
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
  //             {loading ? "Creating..." : "Create User"}
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   );
};

export default CreateUser;
