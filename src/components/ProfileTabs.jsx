import React from "react";
import { User, Ticket, Heart, Shield } from "lucide-react";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", name: "Profile Info", icon: User },
    { id: "bookings", name: "Booking History", icon: Ticket },
    { id: "favorites", name: "Favorites", icon: Heart },
    { id: "settings", name: "Settings", icon: Shield },
  ];

  return (
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
  );
};

export default ProfileTabs;
