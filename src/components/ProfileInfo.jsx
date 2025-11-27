import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { updateMyInfo } from "../service/ProfileService";

const ProfileInfo = ({
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  myInfo,
  setMyInfo,
}) => {
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const res = await updateMyInfo(formData);
    setMyInfo({ ...myInfo, ...formData });
    setIsEditing(false);
    toast(res);
  };

  const handleCancel = () => {
    setFormData({
      userName: myInfo?.userName || "",
      firstName: myInfo?.firstName || "",
      lastName: myInfo?.lastName || "",
      emailAddress: myInfo?.emailAddress || "",
      phoneNumber: myInfo?.phoneNumber || "",
      dob: myInfo?.dob || "",
      address: myInfo?.address || "",
      avatar: myInfo?.avatar || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <User className="w-4 h-4" />
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
              isEditing
                ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                : "cursor-not-allowed opacity-70"
            } transition-all`}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <User className="w-4 h-4" />
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
              isEditing
                ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                : "cursor-not-allowed opacity-70"
            } transition-all`}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <User className="w-4 h-4" />
            User Name
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
              isEditing
                ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                : "cursor-not-allowed opacity-70"
            } transition-all`}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
              isEditing
                ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                : "cursor-not-allowed opacity-70"
            } transition-all`}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
              isEditing
                ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                : "cursor-not-allowed opacity-70"
            } transition-all`}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
              isEditing
                ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                : "cursor-not-allowed opacity-70"
            } transition-all`}
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <MapPin className="w-4 h-4" />
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter your address"
            className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 ${
              isEditing
                ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                : "cursor-not-allowed opacity-70"
            } transition-all`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
