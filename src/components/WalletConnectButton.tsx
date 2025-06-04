import React from "react";
import { useWallet } from "@vela-ventures/aosync-sdk-react";

interface WalletConnectButtonProps {
  className?: string;
}

function WalletConnectButton({ className = "" }: WalletConnectButtonProps) {
  const { isConnected, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {isConnected ? (
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2 border border-white border-opacity-20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-200">
                Connected
              </span>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="group relative px-4 py-2 bg-red-500 bg-opacity-80 hover:bg-opacity-100 backdrop-blur-sm rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-400 border-opacity-30"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">🔌</span>
              <span className="hidden sm:inline">Disconnect</span>
            </div>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 backdrop-blur-sm rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-white border-opacity-20"
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">🦋</span>
            <span>Connect Beacon</span>
          </div>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>
      )}
    </div>
  );
}

export default WalletConnectButton;
