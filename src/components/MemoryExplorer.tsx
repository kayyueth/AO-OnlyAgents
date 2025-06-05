import React, { useState, useMemo } from "react";
import sharedMemory from "../data/sharedMemory.json";
import ReactJson from "react-json-view";
import { format, isWithinInterval, parseISO } from "date-fns";

interface SharedMemoryEntry {
  id: string;
  timestamp: string;
  agent: string;
  type: string;
  summary: string;
  [key: string]: unknown;
}

function getUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function MemoryExplorer() {
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [agentFilter, setAgentFilter] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filtered = useMemo(() => {
    return sharedMemory.filter((entry: SharedMemoryEntry) => {
      if (typeFilter && entry.type !== typeFilter) return false;
      if (agentFilter && entry.agent !== agentFilter) return false;
      if (
        searchTerm &&
        !entry.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      if (from && to) {
        const date = parseISO(entry.timestamp);
        if (
          !isWithinInterval(date, { start: parseISO(from), end: parseISO(to) })
        )
          return false;
      }
      return true;
    });
  }, [typeFilter, agentFilter, from, to, searchTerm]);

  const clearFilters = () => {
    setTypeFilter("");
    setAgentFilter("");
    setFrom("");
    setTo("");
    setSearchTerm("");
  };

  const hasActiveFilters =
    typeFilter || agentFilter || from || to || searchTerm;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alpha_signal":
        return "🔵";
      case "beta_signal":
        return "🟡";
      case "gamma_signal":
        return "🟢";
      default:
        return "⚡";
    }
  };

  const getAgentGradient = (agent: string) => {
    return agent.includes("A")
      ? "from-blue-500 to-cyan-600"
      : "from-yellow-500 to-orange-600";
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <span className="text-2xl">🔍</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Memory Explorer
            </h3>
            <p className="text-zinc-300 mt-1">
              Search and filter through agent memory records
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            {filtered.length}
          </div>
          <p className="text-zinc-400 text-sm">
            of {sharedMemory.length} memories
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6 mb-8">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 focus-within:border-orange-500/50 transition-all duration-300">
            <input
              type="text"
              placeholder="Search memory summaries..."
              className="w-full bg-transparent text-zinc-100 rounded-2xl px-6 py-4 pl-14 focus:outline-none placeholder:text-zinc-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-orange-400 text-xl">
              🔍
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Type</label>
            <select
              className="w-full bg-white/5 backdrop-blur-sm text-zinc-100 rounded-xl px-4 py-3 border border-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {getUnique(
                sharedMemory.map((e: SharedMemoryEntry) => e.type)
              ).map((type) => (
                <option key={type} value={type} className="bg-zinc-900">
                  {type.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Agent</label>
            <select
              className="w-full bg-white/5 backdrop-blur-sm text-zinc-100 rounded-xl px-4 py-3 border border-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="">All Agents</option>
              {getUnique(
                sharedMemory.map((e: SharedMemoryEntry) => e.agent)
              ).map((agent) => (
                <option key={agent} value={agent} className="bg-zinc-900">
                  {agent}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              From Date
            </label>
            <input
              type="date"
              className="w-full bg-white/5 backdrop-blur-sm text-zinc-100 rounded-xl px-4 py-3 border border-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">To Date</label>
            <input
              type="date"
              className="w-full bg-white/5 backdrop-blur-sm text-zinc-100 rounded-xl px-4 py-3 border border-white/10 focus:border-orange-500/50 focus:outline-none transition-all duration-300"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 text-sm text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10 hover:border-red-500/50 hover:bg-red-500/10"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {typeFilter && (
              <div className="flex items-center space-x-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm border border-orange-500/30">
                <span>Type: {typeFilter.replace("_", " ").toUpperCase()}</span>
                <button
                  onClick={() => setTypeFilter("")}
                  className="hover:text-white"
                >
                  ×
                </button>
              </div>
            )}
            {agentFilter && (
              <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                <span>Agent: {agentFilter}</span>
                <button
                  onClick={() => setAgentFilter("")}
                  className="hover:text-white"
                >
                  ×
                </button>
              </div>
            )}
            {searchTerm && (
              <div className="flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30">
                <span>Search: "{searchTerm}"</span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-white"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-5xl">🔍</span>
            </div>
            <h4 className="text-2xl font-bold text-zinc-200 mb-3">
              No memories found
            </h4>
            <p className="text-zinc-400 text-lg mb-4">
              {hasActiveFilters
                ? "Try adjusting your search filters"
                : "No memory records available to display"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          filtered.map((entry: SharedMemoryEntry, index) => (
            <div
              key={entry.id}
              className="group/item relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getAgentGradient(
                  entry.agent
                )} rounded-2xl opacity-0 group-hover/item:opacity-10 transition-opacity duration-300`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {getTypeIcon(entry.type)}
                      </span>
                      <div
                        className={`px-3 py-1 rounded-xl text-sm font-semibold bg-gradient-to-r ${getAgentGradient(
                          entry.agent
                        )} text-white shadow-sm`}
                      >
                        {entry.agent}
                      </div>
                    </div>
                    <div className="text-sm text-zinc-400 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                      {entry.type.replace("_", " ").toUpperCase()}
                    </div>
                    <div className="text-sm text-orange-400 bg-orange-500/10 px-3 py-1 rounded-xl border border-orange-500/20">
                      #{entry.id.slice(-6)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400 mb-1">
                      {format(new Date(entry.timestamp), "MMM dd, HH:mm")}
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-zinc-100 mb-3 group-hover/item:text-white transition-colors">
                  {entry.summary}
                </h4>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <ReactJson
                    src={entry}
                    name={false}
                    collapsed={2}
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    theme="monokai"
                    style={{
                      background: "transparent",
                      fontSize: "12px",
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MemoryExplorer;
