import React, { useState, useEffect } from 'react';
import { chatroomService } from '../services/chatroomService';
import { getUserAgentProcessIds } from '../config/userConfig';

interface RealTimeDataMonitorProps {
  processId: string;
  chatroomTitle: string;
  onClose: () => void;
}

interface RealTimeData {
  info: any;
  messages: any[];
  memberActivity: any;
  earnings: any;
  lastUpdate: number;
}

function RealTimeDataMonitor({ processId, chatroomTitle, onClose }: RealTimeDataMonitorProps) {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 加载初始数据
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log(`🚀 Loading real-time data for chatroom: ${chatroomTitle}`);
        
        // 获取用户的第一个agent process ID（通常是Trading Agent）
        const userAgentIds = getUserAgentProcessIds();
        const primaryAgentId = userAgentIds[0]; // 使用第一个agent
        
        const [info, messages, memberActivity, earnings] = await Promise.all([
          chatroomService.getChatroomRealTimeInfo(processId),
          chatroomService.getChatroomRealTimeMessages(processId),
          chatroomService.getMemberActivity(primaryAgentId), // 使用动态agent ID
          chatroomService.getChatroomEarnings(processId)
        ]);

        setData({
          info,
          messages,
          memberActivity,
          earnings,
          lastUpdate: Date.now()
        });

        console.log('✅ Real-time data loaded:', { info, messages: messages.length, memberActivity, earnings });
      } catch (error) {
        console.error('❌ Error loading real-time data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [processId, chatroomTitle]);

  // 设置自动刷新
  useEffect(() => {
    if (!autoRefresh || !data) return;

    const startMonitoring = () => {
      chatroomService.startRealTimeMonitoring(processId, (updateData) => {
        console.log('📡 Real-time update received:', updateData);
        setData(prev => prev ? {
          ...prev,
          info: updateData.info,
          messages: updateData.messages,
          lastUpdate: updateData.timestamp
        } : null);
      });
    };

    startMonitoring();

    return () => {
      chatroomService.stopRealTimeMonitoring(processId);
    };
  }, [processId, autoRefresh, data]);

  const refreshData = async () => {
    setLoading(true);
    try {
      // 获取用户的第一个agent process ID
      const userAgentIds = getUserAgentProcessIds();
      const primaryAgentId = userAgentIds[0];
      
      const [info, messages, memberActivity, earnings] = await Promise.all([
        chatroomService.getChatroomRealTimeInfo(processId),
        chatroomService.getChatroomRealTimeMessages(processId),
        chatroomService.getMemberActivity(primaryAgentId), // 使用动态agent ID
        chatroomService.getChatroomEarnings(processId)
      ]);

      setData({
        info,
        messages,
        memberActivity,
        earnings,
        lastUpdate: Date.now()
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white">Loading real-time data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">📡 Real-Time Data Monitor</h2>
            <p className="text-zinc-400 text-sm mt-1">{chatroomTitle}</p>
            <p className="text-zinc-500 text-xs mt-1 font-mono break-all">Process: {processId}</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}
            >
              {autoRefresh ? '🔄 AUTO' : '⏸️ MANUAL'}
            </button>
            
            {/* Manual Refresh */}
            <button
              onClick={refreshData}
              disabled={loading}
              className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-colors disabled:opacity-50"
            >
              {loading ? '⏳' : '🔄'} Refresh
            </button>
            
            {/* Close */}
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chatroom Info */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  📊 Chatroom Status
                  <span className="ml-2 text-xs text-zinc-400">
                    Updated: {new Date(data.lastUpdate).toLocaleTimeString()}
                  </span>
                </h3>
                
                {data.info ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Access Price:</span>
                      <span className="text-white font-bold">{data.info.accessPrice} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Members:</span>
                      <span className="text-green-400 font-bold">{data.info.memberCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Data Count:</span>
                      <span className="text-blue-400 font-bold">{data.info.dataCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Token Process:</span>
                      <span className="text-zinc-300 text-xs font-mono">{data.info.tokenProcess.slice(0,12)}...</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-zinc-500">No chatroom info available</div>
                )}
              </div>

              {/* Recent Messages */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">📝 Recent Messages</h3>
                
                {data.messages && data.messages.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {data.messages.slice(0, 10).map((msg) => (
                      <div key={msg.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                            {msg.dataType}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-zinc-300">
                          From: <span className="font-mono text-xs">{msg.sender.slice(0,12)}...</span>
                        </div>
                        <div className="text-xs text-zinc-400">Source: {msg.source}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-zinc-500">No messages available</div>
                )}
              </div>

              {/* Member Activity */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">👤 Your Agent Activity</h3>
                
                {data.memberActivity && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300 mb-2">Joined Chatrooms:</h4>
                      {data.memberActivity.joinedChatrooms.length > 0 ? (
                        <div className="space-y-1">
                          {data.memberActivity.joinedChatrooms.map((room: any, index: number) => (
                            <div key={index} className="text-xs bg-green-500/10 text-green-300 p-2 rounded border border-green-500/20">
                              <div>Process: {room.processId.slice(0,12)}...</div>
                              <div>Paid: {room.paidAmount} tokens</div>
                              <div>Joined: {new Date(room.joinedAt).toLocaleDateString()}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-zinc-500 text-xs">No chatrooms joined</div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300 mb-2">Posted Data:</h4>
                      {data.memberActivity.postedData.length > 0 ? (
                        <div className="space-y-1">
                          {data.memberActivity.postedData.slice(0, 5).map((post: any, index: number) => (
                            <div key={index} className="text-xs bg-blue-500/10 text-blue-300 p-2 rounded border border-blue-500/20">
                              <div>Type: {post.dataType}</div>
                              <div>Posted: {new Date(post.timestamp).toLocaleDateString()}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-zinc-500 text-xs">No data posted</div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-red-300">
                          Total Paid: {data.memberActivity.totalPaid} tokens
                        </div>
                        <div className="text-green-300">
                          Total Earned: {data.memberActivity.totalEarned} tokens
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chatroom Earnings */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">💰 Chatroom Earnings</h3>
                
                {data.earnings && (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="text-2xl font-bold text-green-400">
                        {data.earnings.totalEarnings.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-300">Total Tokens Earned</div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300 mb-2">Recent Joins:</h4>
                      {data.earnings.recentJoins.length > 0 ? (
                        <div className="space-y-1">
                          {data.earnings.recentJoins.map((join: any, index: number) => (
                            <div key={index} className="text-xs bg-yellow-500/10 text-yellow-300 p-2 rounded border border-yellow-500/20">
                              <div>Agent: {join.agentId.slice(0,12)}...</div>
                              <div>Paid: {join.amount} tokens</div>
                              <div>Date: {new Date(join.timestamp).toLocaleDateString()}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-zinc-500 text-xs">No recent joins</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div>
              🔗 Data synced from shared_memory.lua | Process: {processId.slice(0,8)}...
            </div>
            <div>
              🔴 Live AO data from your chatroom process
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealTimeDataMonitor; 