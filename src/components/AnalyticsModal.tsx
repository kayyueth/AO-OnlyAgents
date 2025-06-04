import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  // Mock data showing token value appreciation over time
  const tokenData = [
    { date: "Jan 1", value: 850, price: 0.85 },
    { date: "Jan 7", value: 920, price: 0.92 },
    { date: "Jan 14", value: 880, price: 0.88 },
    { date: "Jan 21", value: 1050, price: 1.05 },
    { date: "Jan 28", value: 1150, price: 1.15 },
    { date: "Feb 4", value: 1080, price: 1.08 },
    { date: "Feb 11", value: 1280, price: 1.28 },
    { date: "Feb 18", value: 1420, price: 1.42 },
    { date: "Feb 25", value: 1380, price: 1.38 },
    { date: "Mar 4", value: 1650, price: 1.65 },
    { date: "Mar 11", value: 1750, price: 1.75 },
    { date: "Mar 18", value: 1690, price: 1.69 },
    { date: "Mar 25", value: 1850, price: 1.85 },
    { date: "Apr 1", value: 2100, price: 2.1 },
    { date: "Apr 8", value: 2250, price: 2.25 },
    { date: "Apr 15", value: 2180, price: 2.18 },
    { date: "Apr 22", value: 2450, price: 2.45 },
    { date: "Apr 29", value: 2600, price: 2.6 },
    { date: "May 6", value: 2520, price: 2.52 },
    { date: "May 13", value: 2750, price: 2.75 },
    { date: "May 20", value: 2850, price: 2.85 },
    { date: "May 27", value: 2920, price: 2.92 },
    { date: "Jun 3", value: 3100, price: 3.1 },
  ];

  const currentValue = tokenData[tokenData.length - 1].value;
  const initialValue = tokenData[0].value;
  const totalGain = currentValue - initialValue;
  const percentageGain = ((totalGain / initialValue) * 100).toFixed(2);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-lg p-3 shadow-xl">
          <p className="text-zinc-300 text-sm font-medium">{label}</p>
          <p className="text-emerald-400 font-bold">
            {`Value: ${payload[0].value.toLocaleString()} AO`}
          </p>
          <p className="text-blue-400 text-sm">
            {`Price: $${payload[0].payload.price}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Token Analytics
              </h2>
              <p className="text-zinc-400 text-sm">
                Portfolio Performance Over Time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Stats Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-sm text-zinc-400 mb-1">Current Value</div>
            <div className="text-2xl font-bold text-emerald-400">
              {currentValue.toLocaleString()} AO
            </div>
            <div className="text-xs text-zinc-500">$3.10 per token</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-sm text-zinc-400 mb-1">Total Gain</div>
            <div className="text-2xl font-bold text-emerald-400">
              +{totalGain.toLocaleString()} AO
            </div>
            <div className="text-xs text-emerald-500">+{percentageGain}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-sm text-zinc-400 mb-1">Period</div>
            <div className="text-2xl font-bold text-blue-400">6 Months</div>
            <div className="text-xs text-zinc-500">Jan - Jun 2024</div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6 pt-0">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">
                Token Value Over Time
              </h3>
              <p className="text-sm text-zinc-400">
                Your AO token holdings performance with market fluctuations
              </p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={12}
                    tick={{ fill: "#9ca3af" }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tick={{ fill: "#9ca3af" }}
                    tickFormatter={(value) => `${value.toLocaleString()}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorValue)"
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-between items-center">
          <div className="text-xs text-zinc-500">
            Data updates every 15 minutes • Last updated: 2 minutes ago
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors border border-blue-500/30">
              Export Data
            </button>
            <button className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
              Set Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsModal;
