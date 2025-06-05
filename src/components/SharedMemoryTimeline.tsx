import React, { useState } from "react";
import sharedMemory from "../data/sharedMemory.json";
import { format } from "date-fns";

interface SharedMemoryEntry {
  id: string;
  timestamp: string;
  agent: string;
  type: string;
  summary: string;
  [key: string]: unknown;
}

function SharedMemoryTimeline() {
  const [selectedEntry, setSelectedEntry] = useState<SharedMemoryEntry | null>(
    null
  );

  const handleEntryClick = (entry: SharedMemoryEntry) => {
    setSelectedEntry(entry);
  };

  const getAgentConfig = (agent: string) => {
    return agent.includes("A")
      ? {
          gradient: "from-blue-500 to-cyan-600",
          bgGradient: "from-blue-500/10 to-cyan-500/10",
          borderColor: "border-blue-500/30",
          shadowColor: "shadow-blue-500/25",
          dotColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
        }
      : {
          gradient: "from-yellow-500 to-orange-600",
          bgGradient: "from-yellow-500/10 to-orange-500/10",
          borderColor: "border-yellow-500/30",
          shadowColor: "shadow-yellow-500/25",
          dotColor: "bg-gradient-to-br from-yellow-500 to-orange-600",
        };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "data_mining":
        return "🔵";
      case "data_analysis":
        return "🟡";
      default:
        return "⚡";
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "data_mining":
        return "from-blue-500 to-indigo-600";
      case "data_analysis":
        return "from-yellow-500 to-amber-600";
      default:
        return "from-purple-500 to-violet-600";
    }
  };

  return (
    <div className="w-full">
      {sharedMemory.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-zinc-600/20 to-zinc-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📭</span>
          </div>
          <h4 className="text-2xl font-bold text-zinc-200 mb-3">
            No shared memories
          </h4>
          <p className="text-zinc-400 text-lg">
            Memory events will appear here as agents interact
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Animated Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/60 via-purple-500/60 to-pink-500/60 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-8">
            {sharedMemory.map((entry: SharedMemoryEntry, index) => {
              const agentConfig = getAgentConfig(entry.agent);
              return (
                <div
                  key={entry.id}
                  className="relative flex items-start space-x-6 group animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-16 h-16 ${agentConfig.dotColor} rounded-2xl flex items-center justify-center shadow-xl ${agentConfig.shadowColor} group-hover:scale-110 transition-all duration-300 border-4 border-white/20`}
                    >
                      <span className="text-2xl">
                        {getTypeIcon(entry.type)}
                      </span>
                    </div>
                    {/* Connecting line to card */}
                    <div className="absolute top-8 left-16 w-6 h-0.5 bg-gradient-to-r from-white/30 to-transparent"></div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handleEntryClick(entry)}
                      className="w-full text-left group/card"
                    >
                      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1">
                        {/* Gradient overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${agentConfig.bgGradient} rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`}
                        ></div>

                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`px-4 py-2 rounded-xl font-semibold bg-gradient-to-r ${agentConfig.gradient} text-white shadow-lg ${agentConfig.shadowColor}`}
                              >
                                {entry.agent}
                              </div>
                              <div
                                className={`px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r ${getTypeGradient(
                                  entry.type
                                )} text-white shadow-md`}
                              >
                                {entry.type.replace("_", " ").toUpperCase()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-zinc-300 font-medium">
                                {format(new Date(entry.timestamp), "MMM dd")}
                              </div>
                              <div className="text-xs text-zinc-400">
                                {format(new Date(entry.timestamp), "HH:mm")}
                              </div>
                            </div>
                          </div>

                          {/* Summary */}
                          <h4 className="text-lg font-semibold text-zinc-100 mb-3 group-hover/card:text-white transition-colors">
                            {entry.summary}
                          </h4>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-xl border border-green-500/20">
                              ID: #{entry.id.slice(-6)}
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                              <span className="text-sm text-zinc-400">
                                Click for details
                              </span>
                              <span className="text-lg">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enhanced Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 ${
                    getAgentConfig(selectedEntry.agent).dotColor
                  } rounded-2xl flex items-center justify-center shadow-xl`}
                >
                  <span className="text-2xl">
                    {getTypeIcon(selectedEntry.type)}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Memory Details
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`px-4 py-2 rounded-xl font-semibold bg-gradient-to-r ${
                        getAgentConfig(selectedEntry.agent).gradient
                      } text-white shadow-lg`}
                    >
                      {selectedEntry.agent}
                    </div>
                    <div className="text-zinc-300">
                      {format(
                        new Date(selectedEntry.timestamp),
                        "MMMM dd, yyyy 'at' HH:mm"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 group"
                onClick={() => setSelectedEntry(null)}
                aria-label="Close dialog"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  ×
                </span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Summary Section */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center space-x-2">
                    <span>📝</span>
                    <span>Summary</span>
                  </h3>
                  <p className="text-zinc-100 text-lg leading-relaxed">
                    {selectedEntry.summary}
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center space-x-2">
                    <span>🏷️</span>
                    <span>Type</span>
                  </h3>
                  <div
                    className={`inline-flex px-4 py-2 rounded-xl font-semibold bg-gradient-to-r ${getTypeGradient(
                      selectedEntry.type
                    )} text-white shadow-lg`}
                  >
                    {selectedEntry.type.replace("_", " ").toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Raw Data Section */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center space-x-2">
                  <span>🔧</span>
                  <span>Raw Data</span>
                </h3>
                <div className="bg-black/30 rounded-xl p-4 border border-white/10 max-h-96 overflow-auto custom-scrollbar">
                  <pre className="text-sm text-zinc-200 whitespace-pre-wrap">
                    {JSON.stringify(selectedEntry, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SharedMemoryTimeline;
