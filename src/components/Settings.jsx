import React from "react";
import { Shield, CreditCard } from "lucide-react";

const Settings = ({ setShowChangePasswordModal }) => {
  return (
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
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dull rounded-lg transition-colors"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
