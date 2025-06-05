import React, { useState, useCallback, useEffect } from "react";
import { useWallet } from "@vela-ventures/aosync-sdk-react";

interface WalletConnectButtonProps {
  className?: string;
}

function WalletConnectButton({ className = "" }: WalletConnectButtonProps) {
  const { isConnected, connect, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // 监听钱包状态变化
  useEffect(() => {
    console.log(`🔍 Wallet state changed: isConnected = ${isConnected}`);
  }, [isConnected]);

  // 监听连接状态变化
  useEffect(() => {
    console.log(`🔄 Connection state: isConnecting = ${isConnecting}, isDisconnecting = ${isDisconnecting}`);
  }, [isConnecting, isDisconnecting]);

  const handleConnect = useCallback(async () => {
    if (isConnecting) {
      console.log('🔄 Already connecting, ignoring request');
      return;
    }

    console.log('🚀 Starting wallet connection...');
    setIsConnecting(true);
    setLastError(null);

    try {
      await connect();
      console.log('✅ Wallet connected successfully');
      setLastError(null);
    } catch (error) {
      console.error("❌ Failed to connect wallet:", error);

      // Only show error if it's not user cancellation
      if (
        error instanceof Error &&
        !error.message.includes("User rejected") &&
        !error.message.includes("cancelled") &&
        !error.message.includes("canceled")
      ) {
        console.error("💥 Connection error details:", error);
        setLastError("Connection failed. Please try again.");
      } else {
        console.log('👤 User cancelled connection');
      }
    } finally {
      setIsConnecting(false);
      console.log('🏁 Connection attempt finished');
    }
  }, [connect, isConnecting]);

  const handleDisconnect = useCallback(async () => {
    if (isDisconnecting) {
      console.log('🔄 Already disconnecting, ignoring request');
      return;
    }

    console.log('🔌 Starting wallet disconnection...');
    setIsDisconnecting(true);
    try {
      await disconnect();
      console.log('✅ Wallet disconnected successfully');
      setLastError(null);
    } catch (error) {
      console.error("❌ Failed to disconnect wallet:", error);
      setLastError("Disconnection failed. Please try again.");
    } finally {
      setIsDisconnecting(false);
      console.log('🏁 Disconnection attempt finished');
    }
  }, [disconnect, isDisconnecting]);

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className="flex items-center space-x-3">
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
              disabled={isDisconnecting}
              className="group relative px-4 py-2 bg-red-500 bg-opacity-80 hover:bg-opacity-100 backdrop-blur-sm rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-400 border-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center space-x-2">
                {isDisconnecting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="text-sm">🔌</span>
                )}
                <span className="hidden sm:inline">
                  {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                </span>
              </div>
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 backdrop-blur-sm rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-white border-opacity-20 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center space-x-2">
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="text-lg">🦋</span>
              )}
              <span>{isConnecting ? "Connecting..." : "Connect Beacon"}</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        )}
      </div>

      {/* Simple error message */}
      {lastError && !isConnecting && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2 max-w-xs">
          <p className="text-red-300 text-xs text-center">{lastError}</p>
          <button
            onClick={handleConnect}
            className="text-red-200 hover:text-white text-xs underline mt-1 block mx-auto"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default WalletConnectButton;
