import React, { useState } from "react";

interface AgentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: "A" | "B";
  agentName: string;
  agentRole: string;
}

interface DataMinerSettings {
  dataPipeline: string;
  dataType: string;
  frequency: string;
}

interface DataAnalystSettings {
  bindedDeAgent: string;
  llmApi: string;
  researchType: string;
  dataNeeds: string;
  analysisFrequency: string;
}

function AgentSettingsModal({
  isOpen,
  onClose,
  agent,
  agentName,
  agentRole,
}: AgentSettingsModalProps) {
  const isDataMiner = agentRole === "Data Miner";

  // Data Miner settings state
  const [dataMinerSettings, setDataMinerSettings] = useState<DataMinerSettings>(
    {
      dataPipeline: "subgraph",
      dataType: "defi-protocols",
      frequency: "15min",
    }
  );

  // Data Analyst settings state
  const [dataAnalystSettings, setDataAnalystSettings] =
    useState<DataAnalystSettings>({
      bindedDeAgent: "",
      llmApi: "gpt-4",
      researchType: "market-sentiment",
      dataNeeds: "price-volume",
      analysisFrequency: "1hour",
    });

  const dataPipelineOptions = [
    { value: "subgraph", label: "The Graph Subgraph" },
    { value: "alchemy", label: "Alchemy Node" },
    { value: "chainlink", label: "Chainlink Oracle" },
    { value: "moralis", label: "Moralis Web3 API" },
    { value: "covalent", label: "Covalent API" },
  ];

  const dataTypeOptions = [
    { value: "defi-protocols", label: "DeFi Protocols" },
    { value: "nft-collections", label: "NFT Collections" },
    { value: "token-metrics", label: "Token Metrics" },
    { value: "whale-movements", label: "Whale Movements" },
    { value: "liquidity-pools", label: "Liquidity Pools" },
    { value: "governance-proposals", label: "Governance Proposals" },
  ];

  const frequencyOptions = [
    { value: "5min", label: "Every 5 minutes" },
    { value: "15min", label: "Every 15 minutes" },
    { value: "30min", label: "Every 30 minutes" },
    { value: "1hour", label: "Every hour" },
    { value: "6hours", label: "Every 6 hours" },
    { value: "12hours", label: "Every 12 hours" },
    { value: "24hours", label: "Daily" },
  ];

  const llmApiOptions = [
    { value: "gpt-4", label: "OpenAI GPT-4" },
    { value: "gpt-3.5-turbo", label: "OpenAI GPT-3.5 Turbo" },
    { value: "claude-3-sonnet", label: "Anthropic Claude 3 Sonnet" },
    { value: "claude-3-haiku", label: "Anthropic Claude 3 Haiku" },
    { value: "gemini-pro", label: "Google Gemini Pro" },
    { value: "deepseek-chat", label: "DeepSeek Chat" },
    { value: "llama-2-70b", label: "Meta Llama 2 70B" },
  ];

  const researchTypeOptions = [
    { value: "market-sentiment", label: "Market Sentiment Analysis" },
    { value: "price-prediction", label: "Price Prediction" },
    { value: "risk-assessment", label: "Risk Assessment" },
    { value: "trend-analysis", label: "Trend Analysis" },
    { value: "fundamental-analysis", label: "Fundamental Analysis" },
    { value: "technical-analysis", label: "Technical Analysis" },
    { value: "social-signals", label: "Social Signals Analysis" },
  ];

  const dataNeedsOptions = [
    { value: "price-volume", label: "Price & Volume Data" },
    { value: "social-media", label: "Social Media Metrics" },
    { value: "on-chain-metrics", label: "On-chain Metrics" },
    { value: "news-sentiment", label: "News & Sentiment" },
    { value: "whale-activity", label: "Whale Activity" },
    { value: "defi-metrics", label: "DeFi Metrics" },
    { value: "technical-indicators", label: "Technical Indicators" },
  ];

  const analysisFrequencyOptions = [
    { value: "15min", label: "Every 15 minutes" },
    { value: "30min", label: "Every 30 minutes" },
    { value: "1hour", label: "Every hour" },
    { value: "2hours", label: "Every 2 hours" },
    { value: "4hours", label: "Every 4 hours" },
    { value: "8hours", label: "Every 8 hours" },
    { value: "24hours", label: "Daily" },
  ];

  const handleSave = () => {
    // Here you would save the settings to your backend or state management
    console.log("Saving settings for", agentName);
    if (isDataMiner) {
      console.log("Data Miner Settings:", dataMinerSettings);
    } else {
      console.log("Data Analyst Settings:", dataAnalystSettings);
    }
    onClose();
  };

  if (!isOpen) return null;

  const agentConfig = {
    A: {
      gradient: "from-blue-500 to-cyan-600",
      icon: "⛏️",
    },
    B: {
      gradient: "from-yellow-500 to-orange-600",
      icon: "🔍",
    },
  };

  const config = agentConfig[agent];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100">
      <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <span className="text-2xl">{config.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {agentName} Settings
              </h3>
              <p className="text-zinc-300 text-sm">{agentRole} Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {isDataMiner ? (
            // Data Miner Settings
            <>
              {/* Data Pipeline Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-3">
                  Data Pipeline Source
                </label>
                <select
                  value={dataMinerSettings.dataPipeline}
                  onChange={(e) =>
                    setDataMinerSettings({
                      ...dataMinerSettings,
                      dataPipeline: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-200 focus:border-white/30 focus:outline-none"
                >
                  {dataPipelineOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-zinc-800"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Type Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-3">
                  Data Query Type
                </label>
                <select
                  value={dataMinerSettings.dataType}
                  onChange={(e) =>
                    setDataMinerSettings({
                      ...dataMinerSettings,
                      dataType: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-200 focus:border-white/30 focus:outline-none"
                >
                  {dataTypeOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-zinc-800"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Frequency Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-3">
                  Data Fetch Frequency
                </label>
                <select
                  value={dataMinerSettings.frequency}
                  onChange={(e) =>
                    setDataMinerSettings({
                      ...dataMinerSettings,
                      frequency: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-200 focus:border-white/30 focus:outline-none"
                >
                  {frequencyOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-zinc-800"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            // Data Analyst Settings
            <>
              {/* DeAgent Binding */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-3">
                  Bind with DeAgent (Optional)
                </label>
                <input
                  type="text"
                  value={dataAnalystSettings.bindedDeAgent}
                  onChange={(e) =>
                    setDataAnalystSettings({
                      ...dataAnalystSettings,
                      bindedDeAgent: e.target.value,
                    })
                  }
                  placeholder="Enter DeAgent ID or leave empty"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-200 placeholder-zinc-500 focus:border-white/30 focus:outline-none"
                />
                <p className="text-xs text-zinc-400 mt-1">
                  Leave empty to operate independently
                </p>
              </div>

              {/* LLM API Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-3">
                  LLM API Connection
                </label>
                <select
                  value={dataAnalystSettings.llmApi}
                  onChange={(e) =>
                    setDataAnalystSettings({
                      ...dataAnalystSettings,
                      llmApi: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-200 focus:border-white/30 focus:outline-none"
                >
                  {llmApiOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-zinc-800"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Research Type & Data Needs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-3">
                    Research Type
                  </label>
                  <select
                    value={dataAnalystSettings.researchType}
                    onChange={(e) =>
                      setDataAnalystSettings({
                        ...dataAnalystSettings,
                        researchType: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-200 focus:border-white/30 focus:outline-none"
                  >
                    {researchTypeOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-zinc-800"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-3">
                    Data Requirements
                  </label>
                  <select
                    value={dataAnalystSettings.dataNeeds}
                    onChange={(e) =>
                      setDataAnalystSettings({
                        ...dataAnalystSettings,
                        dataNeeds: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-200 focus:border-white/30 focus:outline-none"
                  >
                    {dataNeedsOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-zinc-800"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Analysis Frequency */}
              <div>
                <label className="block text-sm font-medium text-zinc-200 mb-3">
                  Market Analysis Frequency
                </label>
                <select
                  value={dataAnalystSettings.analysisFrequency}
                  onChange={(e) =>
                    setDataAnalystSettings({
                      ...dataAnalystSettings,
                      analysisFrequency: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-200 focus:border-white/30 focus:outline-none"
                >
                  {analysisFrequencyOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-zinc-800"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2 text-zinc-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-6 py-2 bg-gradient-to-r ${config.gradient} hover:opacity-90 rounded-xl text-white font-medium transition-all duration-300 shadow-lg`}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgentSettingsModal;
