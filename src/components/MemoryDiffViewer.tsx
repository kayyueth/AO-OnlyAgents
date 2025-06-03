import React, { useMemo } from "react";
import agentALog from "../data/agentA_log.json";
import agentBLog from "../data/agentB_log.json";
import sharedMemory from "../data/sharedMemory.json";
import { format } from "date-fns";

interface MemoryDiffViewerProps {
  memoryId: string | null;
}

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  action: string;
  output: string;
  fromAO?: boolean;
  fromPrivate?: boolean;
  memoryId?: string;
}

function MemoryDiffViewer({ memoryId }: MemoryDiffViewerProps) {
  const memory = useMemo(
    () => sharedMemory.find((m: any) => m.id === memoryId),
    [memoryId]
  );
  const agentA = useMemo(
    () => agentALog.find((l: LogEntry) => l.memoryId === memoryId),
    [memoryId]
  );
  const agentB = useMemo(
    () => agentBLog.find((l: LogEntry) => l.memoryId === memoryId),
    [memoryId]
  );

  if (!memoryId || !memory) {
    return (
      <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-800 text-center">
        <div className="text-4xl mb-4">⚖️</div>
        <h3 className="text-xl font-bold text-zinc-100 mb-2">
          Memory Comparison
        </h3>
        <p className="text-zinc-400">
          Select a memory from the timeline or explorer to see how different
          agents used it
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mb-2">
          <span>⚖️</span>
          Memory Usage Comparison
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-400">Memory ID:</span>
          <span className="text-blue-400 font-mono">#{memoryId.slice(-6)}</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-400">
            Created: {format(new Date(memory.timestamp), "MMM dd, yyyy HH:mm")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shared Memory */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 h-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🧠</span>
              <h4 className="font-semibold text-zinc-200">Shared Memory</h4>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-zinc-400 font-medium">Type</span>
                <p className="text-sm text-zinc-100 bg-zinc-700 px-2 py-1 rounded mt-1">
                  {memory.type.replace("_", " ").toUpperCase()}
                </p>
              </div>

              <div>
                <span className="text-xs text-zinc-400 font-medium">
                  Summary
                </span>
                <p className="text-sm text-zinc-100 mt-1">{memory.summary}</p>
              </div>

              <div>
                <span className="text-xs text-zinc-400 font-medium">
                  Details
                </span>
                <div className="bg-zinc-700 rounded p-2 mt-1">
                  <pre className="text-xs text-zinc-200 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(memory.details || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent A Usage */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-blue-500 h-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-400">🤖</span>
              <h4 className="font-semibold text-blue-300">Agent A Usage</h4>
            </div>

            {agentA ? (
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Action Taken
                  </span>
                  <p className="text-sm text-zinc-100 mt-1">{agentA.action}</p>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Output
                  </span>
                  <p className="text-sm text-zinc-300 mt-1">{agentA.output}</p>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Context
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {agentA.fromAO && (
                      <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">
                        AO Network
                      </span>
                    )}
                    {agentA.fromPrivate && (
                      <span className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded text-xs">
                        🔒 Private TEE
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">
                      {agentA.source}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Timestamp
                  </span>
                  <p className="text-xs text-zinc-300 mt-1">
                    {format(new Date(agentA.timestamp), "MMM dd, HH:mm:ss")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">❌</div>
                <p className="text-sm text-zinc-500">No usage found</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Agent A has not interacted with this memory
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Agent B Usage */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800/50 rounded-lg p-4 border-l-4 border-yellow-500 h-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">🤖</span>
              <h4 className="font-semibold text-yellow-300 flex items-center gap-2">
                Agent B Usage
                {agentB?.fromPrivate && (
                  <span title="Used private memory" className="text-sm">
                    🔒
                  </span>
                )}
              </h4>
            </div>

            {agentB ? (
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Action Taken
                  </span>
                  <p className="text-sm text-zinc-100 mt-1">{agentB.action}</p>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Output
                  </span>
                  <p className="text-sm text-zinc-300 mt-1">{agentB.output}</p>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Context
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {agentB.fromAO && (
                      <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs">
                        AO Network
                      </span>
                    )}
                    {agentB.fromPrivate && (
                      <span className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded text-xs">
                        🔒 Private TEE
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">
                      {agentB.source}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 font-medium">
                    Timestamp
                  </span>
                  <p className="text-xs text-zinc-300 mt-1">
                    {format(new Date(agentB.timestamp), "MMM dd, HH:mm:ss")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">❌</div>
                <p className="text-sm text-zinc-500">No usage found</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Agent B has not interacted with this memory
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="mt-6 bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
        <h4 className="font-semibold text-zinc-200 mb-2 flex items-center gap-2">
          <span>📊</span>
          Analysis Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-zinc-400">Memory Owner:</span>
            <p className="text-zinc-100 font-medium">{memory.agent}</p>
          </div>
          <div>
            <span className="text-zinc-400">Agents with Access:</span>
            <p className="text-zinc-100 font-medium">
              {[agentA, agentB].filter(Boolean).length} of 2
            </p>
          </div>
          <div>
            <span className="text-zinc-400">Privacy Level:</span>
            <p className="text-zinc-100 font-medium">
              {agentA?.fromPrivate || agentB?.fromPrivate
                ? "Mixed (Public + Private)"
                : "Public"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryDiffViewer;
