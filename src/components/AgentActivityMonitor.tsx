import React, { useState, useEffect } from "react";
import { AGENT_CONFIG } from "./UserInfoCard";

interface AgentActivityMonitorProps {
  processId: string;
  chatroomTitle: string;
  onClose: () => void;
}

interface AgentActivity {
  agentName: string;
  agentRole: string;
  processId: string;
  activityType: "sending" | "receiving";
  status: "active" | "idle" | "error";
  lastActivity: string;
  messageCount: number;
  dataType: string;
}

export default function AgentActivityMonitor({
  processId,
  chatroomTitle,
  onClose,
}: AgentActivityMonitorProps) {
  const [agentActivity, setAgentActivity] = useState<AgentActivity | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine which agent is bound to this chatroom based on processId
    const loadAgentActivity = () => {
      setLoading(true);

      let boundAgent: AgentActivity;

      if (processId === AGENT_CONFIG.A.processId) {
        // Data Miner Agent - sends data
        boundAgent = {
          agentName: AGENT_CONFIG.A.name,
          agentRole: AGENT_CONFIG.A.role,
          processId: AGENT_CONFIG.A.processId,
          activityType: "sending",
          status: "active",
          lastActivity: "2 minutes ago",
          messageCount: 147,
          dataType: "Subgraph Data",
        };
      } else if (processId === AGENT_CONFIG.B.processId) {
        // Data Analyst Agent - receives data
        boundAgent = {
          agentName: AGENT_CONFIG.B.name,
          agentRole: AGENT_CONFIG.B.role,
          processId: AGENT_CONFIG.B.processId,
          activityType: "receiving",
          status: "active",
          lastActivity: "1 minute ago",
          messageCount: 89,
          dataType: "Market Analysis",
        };
      } else {
        // Unknown agent - create generic entry
        boundAgent = {
          agentName: "Unknown Agent",
          agentRole: "Generic Agent",
          processId: processId,
          activityType: "sending",
          status: "idle",
          lastActivity: "Never",
          messageCount: 0,
          dataType: "Unknown",
        };
      }

      setAgentActivity(boundAgent);
      setLoading(false);
    };

    loadAgentActivity();
  }, [processId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "idle":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "error":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  const getActivityIcon = (activityType: string) => {
    return activityType === "sending" ? "📤" : "📥";
  };

  const getAgentIcon = (agentName: string) => {
    return agentName.includes("Miner") ? "⛏️" : "🔍";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-zinc-300">Loading agent activity...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!agentActivity) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Agent Activity Monitor
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                Activity status for {chatroomTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Agent Information */}
        <div className="p-6 space-y-6">
          {/* Agent Profile */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">
                  {getAgentIcon(agentActivity.agentName)}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-zinc-100">
                  {agentActivity.agentName}
                </h4>
                <p className="text-sm text-zinc-400">
                  {agentActivity.agentRole}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  agentActivity.status
                )}`}
              >
                {agentActivity.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Activity Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">
                  {getActivityIcon(agentActivity.activityType)}
                </span>
                <span className="text-sm font-medium text-zinc-300">
                  Activity Type
                </span>
              </div>
              <div className="text-lg font-bold text-zinc-100 capitalize">
                {agentActivity.activityType} Data
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                {agentActivity.activityType === "sending"
                  ? "Publishing data to chatroom"
                  : "Consuming data from chatroom"}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">⏰</span>
                <span className="text-sm font-medium text-zinc-300">
                  Last Activity
                </span>
              </div>
              <div className="text-lg font-bold text-zinc-100">
                {agentActivity.lastActivity}
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Most recent action
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📊</span>
                <span className="text-sm font-medium text-zinc-300">
                  Message Count
                </span>
              </div>
              <div className="text-2xl font-bold text-zinc-100">
                {agentActivity.messageCount.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Total messages processed
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🏷️</span>
                <span className="text-sm font-medium text-zinc-300">
                  Data Type
                </span>
              </div>
              <div className="text-lg font-bold text-zinc-100">
                {agentActivity.dataType}
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Primary data category
              </div>
            </div>
          </div>

          {/* Process Information */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-400">🔗</span>
              <span className="text-sm font-medium text-blue-300">
                AO Process
              </span>
            </div>
            <div className="text-xs text-blue-400 font-mono break-all">
              {agentActivity.processId}
            </div>
            <div className="text-xs text-blue-300 mt-2">
              This agent is bound to the above process ID
            </div>
          </div>

          {/* Activity Description */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-4 border border-indigo-500/20">
            <h5 className="text-sm font-medium text-indigo-300 mb-2">
              How This Agent Works
            </h5>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {agentActivity.activityType === "sending" ? (
                <>
                  This <strong>{agentActivity.agentName}</strong> actively mines
                  and processes data from various sources, then publishes the
                  refined information to this chatroom. It monitors market
                  conditions, analyzes subgraph data, and generates actionable
                  insights for other agents and members.
                </>
              ) : (
                <>
                  This <strong>{agentActivity.agentName}</strong> continuously
                  monitors the chatroom for new data submissions. It analyzes
                  incoming information, performs market analysis, and generates
                  reports based on the collective intelligence gathered from
                  multiple data sources.
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-zinc-300 hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
