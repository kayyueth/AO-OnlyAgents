import React, { useState } from "react";
import { useWallet } from "@vela-ventures/aosync-sdk-react";
import AnalyticsModal from "./AnalyticsModal";

// Shared agent configuration to keep token amounts consistent across components
export const AGENT_CONFIG = {
  A: {
    name: "Trading Agent Alpha",
    processId: "4MNslKqJBo3d3t4PjKc2YGPjx_PXugfZyVGHaGAJA8o",
    tokenAmount: 5000,
    role: "Data Miner",
  },
  B: {
    name: "Data Agent Beta",
    processId: "vyd3NOTV75D3ZEJ1bEpmbAKDuZ56GwnfeTsesK2uUtY",
    tokenAmount: 10000,
    role: "Analyst",
  },
};

// Calculate total user tokens from agent amounts
export const getUserTotalTokens = () => {
  return AGENT_CONFIG.A.tokenAmount + AGENT_CONFIG.B.tokenAmount;
};

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
      name: AGENT_CONFIG.A.name,
      processId: AGENT_CONFIG.A.processId,
    },
    boundAgentB: {
      name: AGENT_CONFIG.B.name,
      processId: AGENT_CONFIG.B.processId,
    },
    tokenCount: getUserTotalTokens(), // Sum of both agents' tokens
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
                Agent Alpha
              </span>
            </div>
            <div className="text-sm text-zinc-200 mb-1">
              {mockUserData.boundAgentA.name}
            </div>
            <div className="font-mono text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1 border border-zinc-700/50">
              {truncateAddress(mockUserData.boundAgentA.processId)}
            </div>
          </div>

          {/* Bound AO Agent B */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🤖</span>
              <span className="text-sm font-medium text-zinc-400">
                Agent Beta
              </span>
            </div>
            <div className="text-sm text-zinc-200 mb-1">
              {mockUserData.boundAgentB.name}
            </div>
            <div className="font-mono text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1 border border-zinc-700/50">
              {truncateAddress(mockUserData.boundAgentB.processId)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className="flex-1 min-w-[140px] px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-medium transition-all duration-300 transform shadow-lg shadow-emerald-500/20"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>View Analytics</span>
            </div>
          </button>

          {onToggleManageAgents && (
            <button
              onClick={onToggleManageAgents}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-medium transition-all duration-300 transform shadow-lg ${
                isManagingAgents
                  ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-orange-500/20"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/20"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{isManagingAgents ? "🔒" : "⚡"}</span>
                <span>
                  {isManagingAgents ? "Hide Agents" : "Manage Agents"}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Token Performance Summary */}
        <div className="mt-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">🪙</span>
              <div>
                <div className="text-sm font-medium text-zinc-400">
                  Token Holdings
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  {mockUserData.tokenCount.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-zinc-400">
                24h Change
              </div>
              <div className="text-lg font-bold text-emerald-400">+12.5%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
}

export default UserInfoCard;
