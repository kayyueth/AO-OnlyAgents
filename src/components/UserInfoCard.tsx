import React, { useState } from "react";
import { useWallet } from "@vela-ventures/aosync-sdk-react";
import AnalyticsModal from "./AnalyticsModal";

interface UserInfoCardProps {
  className?: string;
  isManagingAgents?: boolean;
  onToggleManageAgents?: () => void;
}

function UserInfoCard({
  className = "",
  isManagingAgents = false,
  onToggleManageAgents,
}: UserInfoCardProps) {
  const { isConnected } = useWallet();
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Mock data for demonstration - in a real app, these would come from the SDK or API calls
  const mockUserData = {
    address: "BeaconWalletAddressExample123456789",
    balance: "1.234 AO",
    boundAgentA: {
      name: "Agent A",
      processId: "7XJpnm1724P8Ek0UbTMydBrfLR4g08wStKEynwfjc64",
    },
    boundAgentB: {
      name: "Agent B",
      processId: "9kU1RYzr5WGiQsHxYTP63JFbZqAvWPLBm2FudVZs2ZC",
    },
    tokenCount: 10000,
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className={`group ${className}`}>
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/[0.07]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                User Profile
              </h3>
              <p className="text-zinc-400 text-sm">Connected Wallet Info</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-full text-sm font-medium border border-emerald-500/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wallet Address */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🦋</span>
              <span className="text-sm font-medium text-zinc-400">
                Beacon Wallet
              </span>
            </div>
            <div className="font-mono text-sm text-zinc-200 bg-zinc-800/50 rounded-lg px-3 py-2 border border-zinc-700/50">
              {truncateAddress(mockUserData.address)}
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(mockUserData.address)
              }
              className="text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors"
            >
              Click to copy full address
            </button>
          </div>

          {/* Balance */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">💰</span>
              <span className="text-sm font-medium text-zinc-400">Balance</span>
            </div>
            <div className="text-xl font-bold text-zinc-100">
              {mockUserData.balance}
            </div>
            <div className="text-xs text-zinc-500">Arweave Tokens</div>
          </div>

          {/* Bound AO Agent */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🤖</span>
              <span className="text-sm font-medium text-zinc-400">
                Bound Agent
              </span>
            </div>
            <div className="flex">
              <div className="text-sm font-semibold text-zinc-200 mb-1">
                {mockUserData.boundAgentA.name}
              </div>
              <div className="font-mono text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1 ml-2 border border-zinc-700/50">
                {truncateAddress(mockUserData.boundAgentA.processId)}
              </div>
              <div className="text-sm font-semibold text-zinc-200 mb-1 ml-6">
                {mockUserData.boundAgentB.name}
              </div>
              <div className="font-mono text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1 ml-2 border border-zinc-700/50">
                {truncateAddress(mockUserData.boundAgentB.processId)}
              </div>
            </div>
          </div>

          {/* Token Count */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🪙</span>
              <span className="text-sm font-medium text-zinc-400">Tokens</span>
            </div>
            <div className="text-xl font-bold text-zinc-100">
              {mockUserData.tokenCount.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500">Available Tokens</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/10">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors border border-blue-500/30">
            <span>🔄</span>
            <span>Refresh Data</span>
          </button>
          <button
            onClick={onToggleManageAgents}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              isManagingAgents
                ? "bg-purple-500/30 text-purple-200 border-purple-500/50 hover:bg-purple-500/40"
                : "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
            }`}
          >
            <span>{isManagingAgents ? "👁️" : "⚙️"}</span>
            <span>{isManagingAgents ? "Hide Agents" : "Manage Agents"}</span>
          </button>
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
          >
            <span>📊</span>
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
}

export default UserInfoCard;
