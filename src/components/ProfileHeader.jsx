import React from "react";
import { Camera, Ticket, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";

const ProfileHeader = ({ formData, bookingHistory, favoriteFilms }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl p-8 mb-8 border border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <img
            src={formData.avatar || "https://placehold.co/120x120"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-xl"
          />
          <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">
            {formData.userName || "User Name"}
          </h1>
          <p className="text-gray-400 mb-4">{formData.emailAddress}</p>
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
                {favoriteFilms.length} Favorites
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
  );
};

export default ProfileHeader;
