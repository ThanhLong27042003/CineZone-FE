import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
  Camera,
  Ticket,
  Star,
  CreditCard,
  Shield,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";

const Profile = () => {
  const { myInfo, setMyInfo } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: myInfo?.hoTen || "",
    email: myInfo?.email || "",
    soDt: myInfo?.soDt || "",
    dob: myInfo?.dob || "",
    address: myInfo?.address || "",
  });

  // Mock data - Replace with real API calls
  const bookingHistory = [
    {
      id: 1,
      movieTitle: "Venom: The Last Dance",
      poster: "https://placehold.co/100x150/1a1a1a/ffffff?text=V3",
      theater: "CineZone Theater - Screen 1",
      date: "Nov 10, 2024",
      time: "19:00",
      seats: "A5, A6",
      totalPrice: "$25.00",
      status: "Completed",
    },
    {
      id: 2,
      movieTitle: "Smile 2",
      poster: "https://placehold.co/100x150/1a1a1a/ffffff?text=S2",
      theater: "CineZone Theater - Screen 2",
      date: "Nov 08, 2024",
      time: "21:00",
      seats: "B10, B11",
      totalPrice: "$25.00",
      status: "Completed",
    },
  ];

  const tabs = [
    { id: "profile", name: "Profile Info", icon: User },
    { id: "bookings", name: "Booking History", icon: Ticket },
    { id: "favorites", name: "Favorites", icon: Heart },
    { id: "settings", name: "Settings", icon: Shield },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // TODO: Call API to update profile
    setMyInfo({ ...myInfo, ...formData });
    setIsEditing(false);
    alert("Profile updated successfully! ✅");
  };

  const handleCancel = () => {
    setFormData({
      hoTen: myInfo?.hoTen || "",
      email: myInfo?.email || "",
      soDt: myInfo?.soDt || "",
      dob: myInfo?.dob || "",
      address: myInfo?.address || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Header Card */}
        <motion.div
          className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl p-8 mb-8 border border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={myInfo?.avatar || "https://placehold.co/120x120"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-xl"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {myInfo?.hoTen || "User Name"}
              </h1>
              <p className="text-gray-400 mb-4">{myInfo?.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <Ticket className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-300">
                    {bookingHistory.length} Bookings
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-300">
                    {dummyShowsData.length} Favorites
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Premium Member</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-zinc-800/50 text-gray-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Info Tab */}
          {activeTab === "profile" && (
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Personal Information
                </h2>
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
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
                      isEditing
                        ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                        : "cursor-not-allowed opacity-70"
                    } transition-all`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
                      isEditing
                        ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                        : "cursor-not-allowed opacity-70"
                    } transition-all`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="soDt"
                    value={formData.soDt}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-zinc-800/50 border border-white/10 rounded-lg text-white ${
                      isEditing
                        ? "focus:border-primary focus:ring-2 focus:ring-primary/50"
                        : "cursor-not-allowed opacity-70"
                    } transition-all`}
                  />
                </div>

                {/* Date of Birth */}
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

                {/* Address - Full Width */}
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
          )}

          {/* Booking History Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Booking History
                </h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-primary hover:bg-primary-dull rounded-lg transition-colors text-sm">
                    All
                  </button>
                  <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-400">
                    Upcoming
                  </button>
                  <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-400">
                    Past
                  </button>
                </div>
              </div>

              {bookingHistory.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Movie Poster */}
                    <img
                      src={booking.poster}
                      alt={booking.movieTitle}
                      className="w-full md:w-24 h-36 object-cover rounded-lg"
                    />

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                            {booking.movieTitle}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {booking.theater}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Date</p>
                          <p className="text-sm text-white font-medium">
                            {booking.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Time</p>
                          <p className="text-sm text-white font-medium">
                            {booking.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Seats</p>
                          <p className="text-sm text-white font-medium">
                            {booking.seats}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total</p>
                          <p className="text-sm text-primary font-bold">
                            {booking.totalPrice}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm">
                          <Ticket className="w-4 h-4" />
                          View Ticket
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-colors text-sm">
                          Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="relative overflow-hidden">
              {dummyShowsData.length > 0 ? (
                <>
                  <BlurCircle top="150px" left="0px" />
                  <BlurCircle top="50px" left="50px" />
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Your Favorite Movies
                    </h2>
                    <p className="text-gray-400">
                      {dummyShowsData.length} movies
                    </p>
                  </div>
                  <div className="flex flex-wrap max-sm:justify-center gap-8">
                    {dummyShowsData.map((movie) => (
                      <MovieCard key={movie._id} movie={movie} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Heart className="w-20 h-20 text-gray-600 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No Favorite Movies Yet
                  </h3>
                  <p className="text-gray-400 text-center max-w-md">
                    Start adding movies to your favorites by clicking the heart
                    icon on any movie card.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Account Settings */}
              <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Change Password</p>
                      <p className="text-sm text-gray-400">
                        Update your password regularly
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-primary hover:bg-primary-dull rounded-lg transition-colors">
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Methods
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-primary/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-primary to-purple-500 rounded flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">•••• 4242</p>
                        <p className="text-xs text-gray-400">Expires 12/25</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                      Default
                    </span>
                  </div>
                  <button className="w-full p-4 border-2 border-dashed border-zinc-700 hover:border-primary rounded-lg text-gray-400 hover:text-white transition-all">
                    + Add New Card
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
