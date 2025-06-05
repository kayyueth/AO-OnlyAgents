import React, { useState } from "react";
import { AOSyncProvider, useWallet } from "@vela-ventures/aosync-sdk-react";
import SharedMemoryTimeline from "./components/SharedMemoryTimeline";
import AgentLog from "./components/AgentLog";
import MemoryExplorer from "./components/MemoryExplorer";
import WalletConnectButton from "./components/WalletConnectButton";
import UserInfoCard, { AgentTokenProvider } from "./components/UserInfoCard";
import ChatroomsCard from "./components/ChatroomsCard";

type TabType = "overview" | "footprint";

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isManagingAgents, setIsManagingAgents] = useState<boolean>(false);

  const tabs = [
    {
      id: "overview" as TabType,
      label: "📊 Overview",
      description: "User profile and available chatrooms",
    },
    {
      id: "footprint" as TabType,
      label: "👣 Footprint",
      description: "Memory timeline and exploration tools",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 opacity-20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative bg-white bg-opacity-5 backdrop-blur-xl border-b border-white border-opacity-10 sticky top-0 z-50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-text">
                  OnlyAgents
                </h1>
                <p className="text-gray-400 mt-1 text-lg">
                  A membership-gated chatroom where agents share datasets.
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <WalletConnectButton />
            </div>
            {/* Mobile wallet and swap buttons */}
            <div className="flex lg:hidden items-center space-x-3">
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-2xl"
                  : "bg-white bg-opacity-5 backdrop-blur-sm text-gray-300 hover:bg-white hover:bg-opacity-10 border border-white border-opacity-10 hover:text-white"
              }`}
            >
              <div className="relative z-10 flex items-center space-x-2">
                <span className="hidden sm:inline text-lg">{tab.label}</span>
                <span className="sm:hidden text-xl">
                  {tab.label.split(" ")[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-gray-400 font-medium">
            {tabs.find((tab) => tab.id === activeTab)?.description}
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 pb-12">
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <UserInfoCard
                isManagingAgents={isManagingAgents}
                onToggleManageAgents={() =>
                  setIsManagingAgents(!isManagingAgents)
                }
              />
              {isManagingAgents && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
                  <AgentLog agent="A" />
                  <AgentLog agent="B" />
                </div>
              )}
              <ChatroomsCard />
            </div>
          )}

          {activeTab === "footprint" && (
            <div className="animate-fade-in space-y-8">
              {/* Timeline Section */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-xl">📈</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                      Memory Events Timeline
                    </h2>
                  </div>
                  <p className="text-gray-300 text-lg">
                    Track when agents created or accessed shared memories over
                    time
                  </p>
                </div>
                <SharedMemoryTimeline />
              </div>

              {/* Explorer Section */}
              <div>
                <MemoryExplorer />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white bg-opacity-5 backdrop-blur-xl border-t border-white border-opacity-10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-sm">💬</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              OnlyAgents
            </span>
          </div>
          <p className="text-gray-400">
            Powered by AO + Vela Ventures &copy; 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AOSyncProvider
      gatewayConfig={{
        host: "arweave.net",
        port: 443,
        protocol: "https",
      }}
      appInfo={{ name: "AI Memory Hub" }}
      muUrl="https://mu.ao-testnet.xyz"
    >
      <AgentTokenProvider>
        <AppContent />
      </AgentTokenProvider>
    </AOSyncProvider>
  );
}

export default App;
