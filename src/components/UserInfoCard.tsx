import React, { useState, useContext, createContext, useEffect } from "react";
import { useWallet } from "@vela-ventures/aosync-sdk-react";
import AnalyticsModal from "./AnalyticsModal";
import { userConfigManager, type UserConfig } from "../config/userConfig";

// Agent Token Management Context
interface AgentTokenContextType {
  tokenBalances: { A: number; B: number };
  deductAgentTokens: (agent: "A" | "B", amount: number) => boolean;
  getTotalTokens: () => number;
  userConfig: UserConfig;
}

const AgentTokenContext = createContext<AgentTokenContextType | undefined>(undefined);

export function AgentTokenProvider({ children }: { children: React.ReactNode }) {
  const [tokenBalances, setTokenBalances] = useState({ A: 5000, B: 3500 });
  const [userConfig, setUserConfig] = useState(userConfigManager.getCurrentConfig());
  const wallet = useWallet();
  const { isConnected } = wallet;
  const [addressFetched, setAddressFetched] = useState(false); // 防止重复获取地址

  // 监听钱包连接状态变化
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const getWalletAddress = async () => {
      console.log(`🔍 Wallet state check - isConnected: ${isConnected}, addressFetched: ${addressFetched}`);
      
      // 如果未连接，重置状态
      if (!isConnected) {
        if (isMounted) {
          console.log('📤 Wallet disconnected, resetting config');
          setUserConfig(userConfigManager.getCurrentConfig());
          setAddressFetched(false);
        }
        return;
      }

      // 防止重复获取地址
      if (addressFetched) {
        console.log('📋 Address already fetched, skipping...');
        return;
      }

      try {
        console.log('🔍 Fetching wallet address...');
        
        // 使用较短的延迟，然后获取地址
        timeoutId = setTimeout(async () => {
          if (!isMounted || !isConnected) {
            console.log('⚠️ Component unmounted or wallet disconnected during delay');
            return;
          }
          
          try {
            const address = await wallet.getAddress();
            
            if (address && isMounted && isConnected) {
              console.log(`🔗 Wallet address obtained: ${address.slice(0,6)}...${address.slice(-4)}`);
              
              // 钱包连接时，设置用户配置
              const config = userConfigManager.setUserConfig(address);
              setUserConfig(config);
              setAddressFetched(true);
              
              console.log(`✅ User config set successfully`);
              console.log(`👥 User agents:`, config.agents);
            } else {
              console.log('⚠️ No address obtained or component/wallet state changed');
            }
          } catch (addressError) {
            console.error('❌ Error getting wallet address in timeout:', addressError);
            if (isMounted) {
              setUserConfig(userConfigManager.getCurrentConfig());
              setAddressFetched(false);
            }
          }
        }, 500); // 较短的延迟
        
      } catch (error) {
        console.error('❌ Error setting up wallet address fetch:', error);
        if (isMounted) {
          // 钱包连接失败时，重置为默认配置
          setUserConfig(userConfigManager.getCurrentConfig());
          setAddressFetched(false);
        }
      }
    };

    getWalletAddress();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      console.log('🧹 UserInfoCard effect cleanup');
    };
  }, [isConnected]); // 只依赖 isConnected

  // 监听用户配置变化
  useEffect(() => {
    const unsubscribe = userConfigManager.onConfigChange(setUserConfig);
    return unsubscribe;
  }, []);

  const deductAgentTokens = (agent: "A" | "B", amount: number): boolean => {
    if (tokenBalances[agent] >= amount) {
      setTokenBalances(prev => ({
        ...prev,
        [agent]: prev[agent] - amount
      }));
      return true;
    }
    return false;
  };

  const getTotalTokens = () => tokenBalances.A + tokenBalances.B;

  return (
    <AgentTokenContext.Provider value={{ 
      tokenBalances, 
      deductAgentTokens, 
      getTotalTokens,
      userConfig 
    }}>
      {children}
    </AgentTokenContext.Provider>
  );
}

export function useAgentTokens() {
  const context = useContext(AgentTokenContext);
  if (!context) {
    throw new Error("useAgentTokens must be used within an AgentTokenProvider");
  }
  return context;
}

// 导出用户配置（向后兼容）
export const AGENT_CONFIG = {
  A: userConfigManager.getCurrentConfig().agents.A,
  B: userConfigManager.getCurrentConfig().agents.B,
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
  const { tokenBalances, getTotalTokens, userConfig } = useAgentTokens();

  // Use real user data from userConfig when available
  const userData = {
    address: isConnected ? (userConfig.walletAddress !== "DISCONNECTED" ? userConfig.walletAddress : "Connecting...") : "Not connected",
    balance: "0.00 AO", // This could be fetched from wallet
    boundAgentA: {
      name: userConfig.agents.A.name,
      processId: userConfig.agents.A.processId,
    },
    boundAgentB: {
      name: userConfig.agents.B.name,
      processId: userConfig.agents.B.processId,
    },
    tokenCount: getTotalTokens(),
  };

  const truncateAddress = (addr: string) => {
    if (addr === "Not connected" || addr === "Connecting...") {
      return addr;
    }
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

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
              <p className="text-zinc-400 text-sm">
                {isConnected ? "Connected Wallet Info" : "Connect your wallet to view profile"}
              </p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium border ${
            isConnected 
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" 
              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
            }`}></div>
            <span>{isConnected ? "Active" : "Disconnected"}</span>
          </div>
        </div>

        {/* Conditional Content */}
        {isConnected ? (
          // Connected state - show user info
          <>
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
                  {truncateAddress(userData.address)}
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(userData.address)
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
                  {userData.balance}
                </div>
                <div className="text-xs text-zinc-500">Arweave Tokens</div>
              </div>

              {/* Bound AO Agent Alpha */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🤖</span>
                  <span className="text-sm font-medium text-zinc-400">
                    Agent Alpha
                  </span>
                </div>
                <div className="text-sm text-zinc-200 mb-1">
                  {userData.boundAgentA.name}
                </div>
                <div className="font-mono text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1 border border-zinc-700/50 mb-2">
                  {truncateAddress(userData.boundAgentA.processId)}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-zinc-500">Tokens:</span>
                  <span className="text-sm font-bold text-blue-400">
                    {tokenBalances.A.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bound AO Agent Beta */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🤖</span>
                  <span className="text-sm font-medium text-zinc-400">
                    Agent Beta
                  </span>
                </div>
                <div className="text-sm text-zinc-200 mb-1">
                  {userData.boundAgentB.name}
                </div>
                <div className="font-mono text-xs text-zinc-400 bg-zinc-800/50 rounded px-2 py-1 border border-zinc-700/50 mb-2">
                  {truncateAddress(userData.boundAgentB.processId)}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-zinc-500">Tokens:</span>
                  <span className="text-sm font-bold text-yellow-400">
                    {tokenBalances.B.toLocaleString()}
                  </span>
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
                      Total Token Holdings
                    </div>
                    <div className="text-xl font-bold text-emerald-400">
                      {userData.tokenCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Alpha: {tokenBalances.A.toLocaleString()} | Beta:{" "}
                      {tokenBalances.B.toLocaleString()}
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
          </>
        ) : (
          // Disconnected state - show connection prompt
          <div className="text-center py-8">
            <div className="mb-4">
              <span className="text-4xl mb-4 block">🔌</span>
              <h4 className="text-xl font-bold text-zinc-300 mb-2">
                Connect Your Wallet
              </h4>
              <p className="text-zinc-500 text-sm">
                Connect your Beacon wallet to view your profile, manage agents, and access exclusive chatrooms.
              </p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 mb-4">
              <p className="text-blue-300 text-sm">
                📱 Click the "Connect Beacon" button in the top-right corner to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Modal */}
      {isConnected && (
        <AnalyticsModal
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
        />
      )}
    </div>
  );
}

export default UserInfoCard;
