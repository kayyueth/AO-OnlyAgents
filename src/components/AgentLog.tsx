import React, { useMemo } from "react";
import agentALog from "../data/agentA_log.json";
import agentBLog from "../data/agentB_log.json";
import { format } from "date-fns";

interface AgentLogEntry {
  id: string;
  timestamp: string;
  source: string;
  action: string;
  output: string;
  fromAO?: boolean;
  fromPrivate?: boolean;
  memoryId?: string;
}

interface AgentLogProps {
  agent: "A" | "B";
  onMemorySelect?: (memoryId: string | null) => void;
}

function AgentLog({ agent, onMemorySelect }: AgentLogProps) {
  const logs: AgentLogEntry[] = useMemo(() => {
    return agent === "A" ? agentALog : agentBLog;
  }, [agent]);

  const handleLogClick = (log: AgentLogEntry) => {
    if (log.memoryId && onMemorySelect) {
      onMemorySelect(log.memoryId);
    }
  };

  const agentConfig = {
    A: {
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      icon: "🤖",
      shadowColor: "shadow-blue-500/20",
      processId: "7XJpnm1724P8Ek0UbTMydBrfLR4g08wStKEynwfjc64",
      tokenAmount: 5000,
    },
    B: {
      gradient: "from-yellow-500 to-orange-600",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-400",
      icon: "🤖",
      shadowColor: "shadow-yellow-500/20",
      processId: "9kU1RYzr5WGiQsHxYTP63JFbZqAvWPLBm2FudVZs2ZC",
      tokenAmount: 10000,
    },
  };

  const config = agentConfig[agent];

  return (
    <div className="group">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/[0.07] h-fit">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div
              className={`w-14 h-14 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg ${config.shadowColor} group-hover:scale-110 transition-transform duration-300`}
            >
              <span className="text-2xl">{config.icon}</span>
            </div>
            <div>
              <h3
                className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
              >
                Agent {agent}
              </h3>
              <p className="text-zinc-400 text-sm">Activity Monitor</p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
            >
              {logs.length}
            </div>
            <p className="text-zinc-400 text-sm">Events</p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div
              className="text-lg font-bold text-zinc-100 truncate"
              title={config.processId}
            >
              {config.processId.slice(0, 8)}...
            </div>
            <div className="text-xs text-zinc-400">Process ID</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-lg font-bold text-zinc-100">{logs.length}</div>
            <div className="text-xs text-zinc-400"># of Messages</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-lg font-bold text-zinc-100">
              {config.tokenAmount.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-400">Token Amount</div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-zinc-600/20 to-zinc-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h4 className="text-lg font-semibold text-zinc-300 mb-2">
                No Activity
              </h4>
              <p className="text-zinc-500">
                No events have been logged for this agent yet
              </p>
            </div>
          ) : (
            [...logs].reverse().map((log, index) => (
              <div
                key={log.id}
                onClick={() => handleLogClick(log)}
                className={`group/item relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 ${
                  log.memoryId
                    ? "cursor-pointer hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1"
                    : ""
                } animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient border effect for clickable items */}
                {log.memoryId && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl opacity-0 group-hover/item:opacity-20 transition-opacity duration-300`}
                  ></div>
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-zinc-400 font-medium">
                        {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                      </span>
                      {log.memoryId && (
                        <div
                          className={`px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${config.gradient} text-white shadow-sm`}
                        >
                          #{log.memoryId.slice(-6)}
                        </div>
                      )}
                    </div>
                    {log.memoryId && (
                      <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <span className="text-xs text-zinc-400">
                          Click to compare →
                        </span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-zinc-100 mb-2 group-hover/item:text-white transition-colors">
                    {log.action}
                  </h4>

                  <p className="text-xs text-zinc-300 mb-3 line-clamp-2 group-hover/item:text-zinc-200 transition-colors">
                    {log.output}
                  </p>

                  <div className="flex flex-wrap gap-2 items-center">
                    {log.fromAO && (
                      <div className="flex items-center space-x-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-xs font-medium border border-blue-500/30">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span>AO Network</span>
                      </div>
                    )}
                    {log.fromPrivate && (
                      <div className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-lg text-xs font-medium border border-yellow-500/30">
                        <span>🔒</span>
                        <span>Private TEE</span>
                      </div>
                    )}
                    <div className="text-xs text-zinc-500 bg-zinc-700/50 px-2 py-1 rounded-lg">
                      {log.source}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentLog;
