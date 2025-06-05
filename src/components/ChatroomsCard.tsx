import React, { useState, useEffect, useMemo } from "react";
import { useWallet } from "@vela-ventures/aosync-sdk-react";
import chatroomsData from "../data/chatroom.json";
import { chatroomService, ExtendedChatroom } from "../services/chatroomService";
import ChatroomDataPoster from "./ChatroomDataPoster";
import { AGENT_CONFIG, useAgentTokens } from "./UserInfoCard";

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

// Agent selection modal component
interface AgentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent: (agent: "A" | "B") => void;
  room: ExtendedChatroom;
  tokenBalances: { A: number; B: number };
}

function AgentSelectionModal({
  isOpen,
  onClose,
  onSelectAgent,
  room,
  tokenBalances,
}: AgentSelectionModalProps) {
  if (!isOpen) return null;

  const agents = [
    {
      key: "A" as const,
      name: AGENT_CONFIG.A.name,
      role: AGENT_CONFIG.A.role,
      icon: "⛏️",
      gradient: "from-blue-500 to-cyan-600",
      tokens: tokenBalances.A,
      canAfford: tokenBalances.A >= room.tokenRequirement,
    },
    {
      key: "B" as const,
      name: AGENT_CONFIG.B.name,
      role: AGENT_CONFIG.B.role,
      icon: "🔍",
      gradient: "from-yellow-500 to-orange-600",
      tokens: tokenBalances.B,
      canAfford: tokenBalances.B >= room.tokenRequirement,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Select Agent to Join</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-zinc-300 text-sm mb-4">
          Choose which agent will join "{room.title}" (Cost:{" "}
          {room.tokenRequirement} tokens)
        </p>

        <div className="space-y-3">
          {agents.map((agent) => (
            <button
              key={agent.key}
              onClick={() => onSelectAgent(agent.key)}
              disabled={!agent.canAfford}
              className={`w-full p-4 rounded-xl border transition-all duration-300 ${
                agent.canAfford
                  ? `bg-gradient-to-r ${agent.gradient}/10 border-white/20 hover:border-white/30 hover:bg-white/5`
                  : "bg-red-500/10 border-red-500/30 cursor-not-allowed opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{agent.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-white">{agent.name}</div>
                    <div className="text-xs text-zinc-400">{agent.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${
                      agent.canAfford ? "text-white" : "text-red-300"
                    }`}
                  >
                    {agent.tokens.toLocaleString()}
                  </div>
                  <div className="text-xs text-zinc-400">tokens</div>
                </div>
              </div>

              {!agent.canAfford && (
                <div className="mt-2 text-xs text-red-300 text-center">
                  Insufficient tokens (need{" "}
                  {room.tokenRequirement - agent.tokens} more)
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-zinc-500 text-center">
          Tokens will be deducted from the selected agent's balance
        </div>
      </div>
    </div>
  );
}

function ChatroomsCard({ className = "" }: ChatroomsCardProps) {
  const walletContext = useWallet();
  const { isConnected } = walletContext;
  const [chatrooms, setChatrooms] = useState<ExtendedChatroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningRoom, setJoiningRoom] = useState<string | null>(null);
  const [leavingRoom, setLeavingRoom] = useState<string | null>(null);
  const [posterData, setPosterData] = useState<{
    processId: string;
    title: string;
  } | null>(null);
  const [lastConnectedState, setLastConnectedState] = useState<boolean>(false);
  const [joinedChatroomIds, setJoinedChatroomIds] = useState<string[]>([]);

  // Agent selection modal state
  const [showAgentSelection, setShowAgentSelection] =
    useState<ExtendedChatroom | null>(null);

  // Use shared token management
  const { tokenBalances, deductAgentTokens, getTotalTokens } = useAgentTokens();

  // Get user's agent process IDs from shared config (memoized to prevent re-renders)
  const userAgentProcessIds = useMemo(
    () => [
      AGENT_CONFIG.A.processId, // Trading Agent Alpha
      AGENT_CONFIG.B.processId, // Data Agent Beta (user's process)
    ],
    []
  );

  // Initialize service with wallet and load chatrooms
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted

    const loadChatrooms = async () => {
      if (!isMounted) return;

      setLoading(true);
      try {
        // Set wallet context in service if connected
        if (isConnected) {
          chatroomService.setWallet(walletContext);
        }

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () =>
              reject(new Error("Loading timeout - falling back to mock data")),
            8000
          ); // 8 second timeout
        });

        const loadingPromise = (async () => {
          console.log("🔄 Starting chatroom data loading...");

          // Check which chatrooms the user's agents have joined
          const allJoinedChatrooms: string[] = [];
          for (const agentProcessId of userAgentProcessIds) {
            if (!isMounted) return;

            try {
              console.log(
                `🔍 Checking chatrooms for agent: ${agentProcessId.slice(
                  0,
                  8
                )}...`
              );
              const joinedRooms = await chatroomService.getJoinedChatrooms(
                agentProcessId
              );
              allJoinedChatrooms.push(...joinedRooms);
            } catch (error) {
              console.error(
                `Error checking joined chatrooms for agent ${agentProcessId}:`,
                error
              );
            }
          }

          if (!isMounted) return;

          // Remove duplicates
          const uniqueJoinedChatrooms = [...new Set(allJoinedChatrooms)];
          setJoinedChatroomIds(uniqueJoinedChatrooms);
          console.log(
            `🔗 User agents are members of ${uniqueJoinedChatrooms.length} chatrooms:`,
            uniqueJoinedChatrooms
          );

          // Enhance mock data with real AO data
          console.log("📊 Loading chatroom details...");
          const mockChatrooms = chatroomsData as Chatroom[];
          const enhancedChatrooms =
            await chatroomService.enhanceChatroomsWithRealData(mockChatrooms);

          if (!isMounted) return;

          setChatrooms(enhancedChatrooms);
          setLastConnectedState(isConnected);
          console.log("✅ Chatroom loading completed successfully");
        })();

        // Race between loading and timeout
        try {
          await Promise.race([loadingPromise, timeoutPromise]);
        } catch (timeoutError) {
          console.warn(
            "⏰ Loading timed out, using fallback data:",
            timeoutError
          );
          if (isMounted) {
            // Use mock data as fallback
            setChatrooms(chatroomsData as ExtendedChatroom[]);
            setLastConnectedState(isConnected);
          }
        }
      } catch (error) {
        console.error("❌ Error loading chatrooms:", error);
        if (isMounted) {
          // Fallback to mock data
          setChatrooms(chatroomsData as ExtendedChatroom[]);
          setLastConnectedState(isConnected);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    console.log(
      `🚀 Loading chatrooms - isConnected: ${isConnected}, lastConnectedState: ${lastConnectedState}`
    );
    loadChatrooms();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [isConnected]); // Only depend on connection state

  const handleJoinChatroomClick = (room: ExtendedChatroom) => {
    if (!room.processId) {
      alert(
        "This is a mock chatroom. Real chatroom functionality coming soon!"
      );
      return;
    }

    // Check if any agent has enough tokens
    const canAfford =
      tokenBalances.A >= room.tokenRequirement ||
      tokenBalances.B >= room.tokenRequirement;

    if (!canAfford) {
      alert(
        `Insufficient tokens! You need ${room.tokenRequirement} tokens but your agents have ${tokenBalances.A} and ${tokenBalances.B} tokens respectively.`
      );
      return;
    }

    // Show agent selection modal
    setShowAgentSelection(room);
  };

  const handleAgentSelection = async (
    agent: "A" | "B",
    room: ExtendedChatroom
  ) => {
    setShowAgentSelection(null);
    setJoiningRoom(room.id);

    try {
      // Deduct tokens from selected agent
      const success = deductAgentTokens(agent, room.tokenRequirement);

      if (!success) {
        alert(
          `Insufficient tokens! Agent ${agent} needs ${room.tokenRequirement} tokens but only has ${tokenBalances[agent]}.`
        );
        return;
      }

      // Add chatroom to joined list (mock joining)
      if (room.processId && !joinedChatroomIds.includes(room.processId)) {
        setJoinedChatroomIds((prev) => [...prev, room.processId!]);
      }

      // For real chatrooms, also try to join via service
      if (room.isReal && room.processId) {
        const result = await chatroomService.joinChatroom(room.processId);

        if (!result.success && result.paymentRequired) {
          // If real service fails, we keep the mock join but show warning
          console.warn(`Real service join failed: ${result.message}`);
        }
      }

      const agentName =
        agent === "A" ? AGENT_CONFIG.A.name : AGENT_CONFIG.B.name;
      alert(
        `Successfully joined ${room.title} with ${agentName}! ${room.tokenRequirement} tokens deducted from Agent ${agent}.`
      );

      // Refresh chatroom data
      const mockChatrooms = chatroomsData as Chatroom[];
      const enhancedChatrooms =
        await chatroomService.enhanceChatroomsWithRealData(mockChatrooms);
      setChatrooms(enhancedChatrooms);
    } catch (error) {
      console.error("Error joining chatroom:", error);
      alert("Error joining chatroom. Please try again.");
    } finally {
      setJoiningRoom(null);
    }
  };

  const handleLeaveChatroom = async (room: ExtendedChatroom) => {
    if (!room.processId) {
      alert("Cannot leave mock chatroom.");
      return;
    }

    setLeavingRoom(room.id);
    try {
      // Remove chatroom from joined list (mock leaving)
      setJoinedChatroomIds((prev) =>
        prev.filter((id) => id !== room.processId)
      );

      // Note: In a real implementation, you might want to refund some tokens
      // For now, we don't refund tokens when leaving

      alert(`Successfully left ${room.title}!`);

      // Refresh chatroom data
      const mockChatrooms = chatroomsData as Chatroom[];
      const enhancedChatrooms =
        await chatroomService.enhanceChatroomsWithRealData(mockChatrooms);
      setChatrooms(enhancedChatrooms);
    } catch (error) {
      console.error("Error leaving chatroom:", error);
      alert("Error leaving chatroom. Please try again.");
    } finally {
      setLeavingRoom(null);
    }
  };

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
    // If wallet is not connected, show all chatrooms as accessible
    if (!isConnected) {
      return true;
    }
    // If wallet is connected, check if either agent has enough tokens
    return (
      tokenBalances.A >= tokenRequirement || tokenBalances.B >= tokenRequirement
    );
  };

  const isAlreadyJoined = (room: ExtendedChatroom) => {
    return Boolean(
      room.processId && joinedChatroomIds.includes(room.processId)
    );
  };

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
                Join chatrooms for your agents to trade datasets.
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
        {isConnected && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🪙</span>
                <div>
                  <span className="text-sm font-medium text-zinc-400">
                    Your Tokens:
                  </span>
                  <span className="ml-2 text-lg font-bold text-zinc-100">
                    {getTotalTokens().toLocaleString()}
                  </span>
                  <div className="text-xs text-zinc-500 mt-1">
                    Agent A: {tokenBalances.A.toLocaleString()} | Agent B:{" "}
                    {tokenBalances.B.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-xs text-zinc-500">
                Higher token count = More exclusive rooms
              </div>
            </div>
          </div>
        )}

        {/* Wallet Connection Notice for Non-Connected Users */}
        {!isConnected && (
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-lg">ℹ️</span>
              <div>
                <span className="text-sm font-medium text-blue-300">
                  Browse Mode
                </span>
                <p className="text-xs text-blue-400/80 mt-1">
                  Connect your wallet to access token-gated features and join
                  exclusive chatrooms
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chatrooms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl p-4 border border-white/10 animate-pulse"
              >
                <div className="h-4 bg-white/10 rounded mb-3"></div>
                <div className="h-6 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 bg-white/10 rounded"></div>
                  <div className="h-12 bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {chatrooms.map((room) => {
              const config = getCategoryConfig(room.category);
              const hasAccess = canAccessChatroom(room.tokenRequirement);
              const isJoining = joiningRoom === room.id;
              const isLeaving = leavingRoom === room.id;
              const isJoined = isAlreadyJoined(room);

              return (
                <div
                  key={room.id}
                  className={`relative bg-white/5 rounded-xl p-4 border border-white/10 transition-all duration-300 ${
                    hasAccess
                      ? "hover:bg-white/10 hover:border-white/20 hover:shadow-lg cursor-pointer hover:scale-[1.02]"
                      : "opacity-50 cursor-not-allowed"
                  } ${
                    isJoined ? "ring-2 ring-green-500/50 bg-green-500/5" : ""
                  }`}
                >
                  {/* Access indicator overlay */}
                  {!hasAccess && isConnected && !isJoined && (
                    <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm font-medium border border-red-500/30">
                        🔒 Requires {room.tokenRequirement} tokens
                      </div>
                    </div>
                  )}

                  {/* Real/Mock indicator and Joined status */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2">
                    {isJoined && (
                      <div className="flex items-center space-x-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs border border-green-500/30">
                        <span>✅</span>
                        <span>JOINED</span>
                      </div>
                    )}
                    {room.isReal ? (
                      <div className="flex items-center space-x-1 bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs border border-green-500/30">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs border border-gray-500/30">
                        <span>DEMO</span>
                      </div>
                    )}
                  </div>

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
                    <div className="flex items-center space-x-1 text-xs text-zinc-500 mr-16">
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
                    <p className="text-xs text-zinc-500 italic">
                      {room.dataset}
                    </p>

                    {/* Real chatroom data indicator */}
                    {room.isReal && room.realData && (
                      <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="text-xs text-green-300 font-medium">
                          📊 Real AO Data: {room.realData.dataCount} messages,{" "}
                          {room.realData.memberCount} members
                        </div>
                        {room.messages && room.messages.length > 0 && (
                          <div className="text-xs text-green-400 mt-1">
                            Latest: {room.messages[0].dataType} from{" "}
                            {room.messages[0].sender.slice(0, 8)}...
                          </div>
                        )}
                        {/* Show process ID for user's specific chatroom */}
                        {room.processId ===
                          "vyd3NOTV75D3ZEJ1bEpmbAKDuZ56GwnfeTsesK2uUtY" && (
                          <div className="text-xs text-blue-300 mt-1 font-mono break-all">
                            YOUR PROCESS: {room.processId}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Enhanced real process indicator */}
                    {room.isReal && room.processId && (
                      <div className="mt-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-xs text-blue-400 font-mono mt-1 break-all">
                          {room.processId ===
                          "vyd3NOTV75D3ZEJ1bEpmbAKDuZ56GwnfeTsesK2uUtY" ? (
                            <span className="text-blue-300">
                              PROCESS ID: {room.processId}
                            </span>
                          ) : (
                            `Process: ${room.processId.slice(0, 12)}...`
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <div className="text-xs text-zinc-400">Active Agents</div>
                      <div className="text-lg font-bold text-zinc-100 flex items-center space-x-1">
                        <span>{room.activeAgents}</span>
                        {room.isReal && (
                          <span className="text-xs text-green-400">🔄</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <div className="text-xs text-zinc-400">Volume (24h)</div>
                      <div className="text-lg font-bold text-zinc-100">
                        {room.transactionVolume}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {hasAccess && (
                    <div className="space-y-2 mt-4">
                      {!isJoined ? (
                        // Join button for non-joined rooms
                        <button
                          className={`w-full px-4 py-2 bg-gradient-to-r ${
                            config.gradient
                          } hover:opacity-90 rounded-lg text-white text-sm font-medium transition-opacity ${
                            !isConnected || isJoining ? "opacity-75" : ""
                          } ${isJoining ? "cursor-not-allowed" : ""}`}
                          disabled={!isConnected || isJoining}
                          onClick={() => handleJoinChatroomClick(room)}
                        >
                          {isJoining ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Joining...</span>
                            </div>
                          ) : room.isReal ? (
                            isConnected ? (
                              `Join AO Chatroom (${room.tokenRequirement} tokens)`
                            ) : (
                              "Connect Wallet to Join"
                            )
                          ) : (
                            "View Demo Room"
                          )}
                        </button>
                      ) : (
                        // Joined state with Leave button
                        <div className="space-y-2">
                          <div className="w-full px-4 py-2 bg-green-600/30 border border-green-500/50 rounded-lg text-green-300 text-sm font-medium text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <span>✅</span>
                              <span>Already Joined</span>
                            </div>
                          </div>

                          {/* Leave button */}
                          <button
                            className={`w-full px-4 py-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 rounded-lg text-red-300 text-sm font-medium transition-colors ${
                              isLeaving ? "cursor-not-allowed opacity-75" : ""
                            }`}
                            disabled={isLeaving}
                            onClick={() => handleLeaveChatroom(room)}
                          >
                            {isLeaving ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin"></div>
                                <span>Leaving...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-2">
                                <span>🚪</span>
                                <span>Leave Chatroom</span>
                              </div>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Post Data button for real chatrooms - show for all joined rooms */}
                      {room.isReal &&
                        room.processId &&
                        isConnected &&
                        isJoined && (
                          <button
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-zinc-300 text-sm font-medium transition-colors"
                            onClick={() =>
                              setPosterData({
                                processId: room.processId!,
                                title: room.title,
                              })
                            }
                          >
                            📤 Post Data
                          </button>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-zinc-500">
            💡 Earn tokens by participating in agent conversations and providing
            valuable insights
          </p>
        </div>
      </div>

      {/* Agent Selection Modal */}
      {showAgentSelection && (
        <AgentSelectionModal
          isOpen={true}
          onClose={() => setShowAgentSelection(null)}
          onSelectAgent={(agent) =>
            handleAgentSelection(agent, showAgentSelection)
          }
          room={showAgentSelection}
          tokenBalances={tokenBalances}
        />
      )}

      {/* ChatroomDataPoster Modal */}
      {posterData && (
        <ChatroomDataPoster
          processId={posterData.processId}
          chatroomTitle={posterData.title}
          onClose={() => setPosterData(null)}
        />
      )}
    </div>
  );
}

export default ChatroomsCard;
