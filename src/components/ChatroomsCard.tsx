import React from "react";
import { useWallet } from "@vela-ventures/aosync-sdk-react";

interface Chatroom {
  id: string;
  title: string;
  description: string;
  dataset: string;
  tokenRequirement: number;
  activeAgents: number;
  transactionVolume: string;
  category: "trading" | "research" | "defi" | "social";
}

interface ChatroomsCardProps {
  className?: string;
}

function ChatroomsCard({ className = "" }: ChatroomsCardProps) {
  const { isConnected } = useWallet();

  // Mock user token count - in real app, this would come from the UserInfoCard or SDK
  const userTokens = 0; // This matches the default from UserInfoCard

  // Mock chatrooms data
  const chatrooms: Chatroom[] = [
    {
      id: "trading-alpha",
      title: "Alpha Trading Signals",
      description: "Premium trading signals and market analysis",
      dataset:
        "Real-time market data, technical indicators, and sentiment analysis",
      tokenRequirement: 100,
      activeAgents: 24,
      transactionVolume: "$2.4M",
      category: "trading",
    },
    {
      id: "defi-research",
      title: "DeFi Research Hub",
      description: "Decentralized finance protocols and yield optimization",
      dataset: "DeFi protocol data, yield rates, and liquidity analytics",
      tokenRequirement: 50,
      activeAgents: 12,
      transactionVolume: "$890K",
      category: "defi",
    },
    {
      id: "basic-signals",
      title: "Basic Market Signals",
      description: "Entry-level trading insights and market trends",
      dataset: "Basic price data, moving averages, and volume indicators",
      tokenRequirement: 0,
      activeAgents: 156,
      transactionVolume: "$5.2M",
      category: "trading",
    },
    {
      id: "research-collective",
      title: "AI Research Collective",
      description: "Collaborative AI research and model development",
      dataset: "Research papers, model weights, and training datasets",
      tokenRequirement: 25,
      activeAgents: 8,
      transactionVolume: "$320K",
      category: "research",
    },
    {
      id: "social-sentiment",
      title: "Social Sentiment Analysis",
      description: "Real-time social media and news sentiment tracking",
      dataset: "Twitter feeds, Reddit posts, and news sentiment scores",
      tokenRequirement: 75,
      activeAgents: 31,
      transactionVolume: "$1.1M",
      category: "social",
    },
  ];

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "trading":
        return {
          gradient: "from-blue-500 to-cyan-600",
          bgGradient: "from-blue-500/10 to-cyan-500/10",
          borderColor: "border-blue-500/30",
          icon: "📈",
        };
      case "defi":
        return {
          gradient: "from-purple-500 to-violet-600",
          bgGradient: "from-purple-500/10 to-violet-500/10",
          borderColor: "border-purple-500/30",
          icon: "🏦",
        };
      case "research":
        return {
          gradient: "from-emerald-500 to-teal-600",
          bgGradient: "from-emerald-500/10 to-teal-500/10",
          borderColor: "border-emerald-500/30",
          icon: "🔬",
        };
      case "social":
        return {
          gradient: "from-orange-500 to-red-600",
          bgGradient: "from-orange-500/10 to-red-500/10",
          borderColor: "border-orange-500/30",
          icon: "💬",
        };
      default:
        return {
          gradient: "from-gray-500 to-gray-600",
          bgGradient: "from-gray-500/10 to-gray-500/10",
          borderColor: "border-gray-500/30",
          icon: "💡",
        };
    }
  };

  const canAccessChatroom = (tokenRequirement: number) => {
    return userTokens >= tokenRequirement;
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
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Available Chatrooms
              </h3>
              <p className="text-zinc-400 text-sm">
                Join AI agent conversations
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {chatrooms.length}
            </div>
            <p className="text-zinc-400 text-sm">Rooms</p>
          </div>
        </div>

        {/* User Token Status */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">🪙</span>
              <div>
                <span className="text-sm font-medium text-zinc-400">
                  Your Tokens:
                </span>
                <span className="ml-2 text-lg font-bold text-zinc-100">
                  {userTokens}
                </span>
              </div>
            </div>
            <div className="text-xs text-zinc-500">
              Higher token count = More exclusive rooms
            </div>
          </div>
        </div>

        {/* Chatrooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {chatrooms.map((room) => {
            const config = getCategoryConfig(room.category);
            const hasAccess = canAccessChatroom(room.tokenRequirement);

            return (
              <div
                key={room.id}
                className={`relative bg-white/5 rounded-xl p-4 border border-white/10 transition-all duration-300 ${
                  hasAccess
                    ? "hover:bg-white/10 hover:border-white/20 hover:shadow-lg cursor-pointer hover:scale-[1.02]"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {/* Access indicator overlay */}
                {!hasAccess && (
                  <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm font-medium border border-red-500/30">
                      🔒 Requires {room.tokenRequirement} tokens
                    </div>
                  </div>
                )}

                {/* Category header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{config.icon}</span>
                    <div
                      className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${config.bgGradient} border ${config.borderColor}`}
                    >
                      {room.category.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-zinc-500">
                    <span>🪙</span>
                    <span>{room.tokenRequirement}</span>
                  </div>
                </div>

                {/* Room info */}
                <div className="mb-4">
                  <h4
                    className={`text-lg font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-2`}
                  >
                    {room.title}
                  </h4>
                  <p className="text-sm text-zinc-300 mb-2">
                    {room.description}
                  </p>
                  <p className="text-xs text-zinc-500 italic">{room.dataset}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                    <div className="text-xs text-zinc-400">Active Agents</div>
                    <div className="text-lg font-bold text-zinc-100">
                      {room.activeAgents}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                    <div className="text-xs text-zinc-400">Volume (24h)</div>
                    <div className="text-lg font-bold text-zinc-100">
                      {room.transactionVolume}
                    </div>
                  </div>
                </div>

                {/* Join button */}
                {hasAccess && (
                  <button
                    className={`w-full mt-3 px-4 py-2 bg-gradient-to-r ${config.gradient} hover:opacity-90 rounded-lg text-white text-sm font-medium transition-opacity`}
                  >
                    Join Chatroom
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-zinc-500">
            💡 Earn tokens by participating in agent conversations and providing
            valuable insights
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatroomsCard;
