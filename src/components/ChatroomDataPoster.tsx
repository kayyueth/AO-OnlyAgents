import React, { useState } from "react";
import { chatroomService } from "../services/chatroomService";

interface ChatroomDataPosterProps {
  processId: string;
  chatroomTitle: string;
  onClose: () => void;
}

export default function ChatroomDataPoster({ processId, chatroomTitle, onClose }: ChatroomDataPosterProps) {
  const [data, setData] = useState("");
  const [dataType, setDataType] = useState("subgraph");
  const [source, setSource] = useState("");
  const [posting, setPosting] = useState(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.trim() || !source.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setPosting(true);
    try {
      const result = await chatroomService.postData(processId, data, dataType, source);
      
      if (result.success) {
        alert("Data posted successfully!");
        setData("");
        setSource("");
        onClose();
      } else {
        alert(`Failed to post data: ${result.message}`);
      }
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Error posting data. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const dataTypes = [
    { value: "subgraph", label: "Subgraph Data", example: '{"prices": [{"token": "ETH", "price": 3500}]}' },
    { value: "signal", label: "Trading Signal", example: '{"signal": "BUY", "token": "ETH", "confidence": 0.85}' },
    { value: "analysis", label: "Market Analysis", example: '{"analysis": "Bullish divergence detected", "timeframe": "4h"}' },
    { value: "news", label: "News/Events", example: '{"event": "ETF approval", "impact": "positive", "timestamp": "2024-01-01"}' }
  ];

  const selectedType = dataTypes.find(t => t.value === dataType);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Post Data to Chatroom
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                Share data with {chatroomTitle}
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

        {/* Form */}
        <form onSubmit={handlePost} className="p-6 space-y-6">
          {/* Data Type Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {dataTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-zinc-800">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Data Source
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., uniswap_v3, compound, technical_analysis"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-500"
              required
            />
          </div>

          {/* Data Content */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Data Content (JSON)
            </label>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder={selectedType?.example || "Enter your data as JSON..."}
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-500 font-mono text-sm"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">
              💡 Tip: Use valid JSON format for better compatibility
            </p>
          </div>

          {/* Example */}
          {selectedType && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">
                Example {selectedType.label}:
              </h4>
              <pre className="text-xs text-zinc-400 font-mono bg-black/20 rounded p-2 overflow-x-auto">
                {selectedType.example}
              </pre>
            </div>
          )}

          {/* Process Info */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">🔗</span>
              <div>
                <div className="text-sm font-medium text-blue-300">AO Process</div>
                <div className="text-xs text-blue-400 font-mono">{processId}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-zinc-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={posting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 rounded-lg text-white font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                "Post Data"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 