import React from "react";
import { Shield, CreditCard } from "lucide-react";

const Settings = ({ setShowChangePasswordModal }) => {
  return (
    <div className="space-y-6">
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
  );
};

export default Settings;
