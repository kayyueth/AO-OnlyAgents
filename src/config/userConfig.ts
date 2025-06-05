// 用户配置 - 绑定钱包地址和 Agent Process IDs
export interface UserAgent {
  name: string;
  role: string;
  processId: string;
  icon: string;
  gradient: string;
}

export interface UserConfig {
  walletAddress: string;
  agents: {
    A: UserAgent;
    B: UserAgent;
  };
  chatroomProcessId?: string; // 用户创建的 chatroom process ID
}

// 默认用户配置（您的账户）
export const DEFAULT_USER_CONFIG: UserConfig = {
  walletAddress: "YOUR_WALLET_ADDRESS", // 将在运行时替换为实际钱包地址
  agents: {
    A: {
      name: "Trading Agent Alpha",
      role: "Market Analysis & Signal Generation",
      processId: "4MNslKqJBo3d3t4PjKc2YGPjx_PXugfZyVGHaGAJA8o",
      icon: "⛏️",
      gradient: "from-blue-500 to-cyan-600"
    },
    B: {
      name: "Data Agent Beta", 
      role: "Data Collection & Processing",
      processId: "vyd3NOTV75D3ZEJ1bEpmbAKDuZ56GwnfeTsesK2uUtY",
      icon: "🔍",
      gradient: "from-yellow-500 to-orange-600"
    }
  },
  chatroomProcessId: "vyd3NOTV75D3ZEJ1bEpmbAKDuZ56GwnfeTsesK2uUtY" // 您的 chatroom 进程
};

// 用户配置管理器
class UserConfigManager {
  private static instance: UserConfigManager;
  private currentConfig: UserConfig = DEFAULT_USER_CONFIG;
  private configCallbacks: ((config: UserConfig) => void)[] = [];

  private constructor() {}

  static getInstance(): UserConfigManager {
    if (!UserConfigManager.instance) {
      UserConfigManager.instance = new UserConfigManager();
    }
    return UserConfigManager.instance;
  }

  // 设置当前用户配置（基于钱包地址）
  setUserConfig(walletAddress: string): UserConfig {
    console.log(`🔗 Setting user config for wallet: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`);
    
    // 目前使用默认配置，但可以扩展为从数据库或映射表查找
    this.currentConfig = {
      ...DEFAULT_USER_CONFIG,
      walletAddress
    };

    // 通知所有监听器
    this.configCallbacks.forEach(callback => callback(this.currentConfig));
    
    return this.currentConfig;
  }

  // 获取当前用户配置
  getCurrentConfig(): UserConfig {
    return this.currentConfig;
  }

  // 获取用户的 Agent Process IDs
  getUserAgentProcessIds(): string[] {
    return [
      this.currentConfig.agents.A.processId,
      this.currentConfig.agents.B.processId
    ];
  }

  // 获取特定 Agent 信息
  getUserAgent(agentKey: 'A' | 'B'): UserAgent {
    return this.currentConfig.agents[agentKey];
  }

  // 检查进程是否属于当前用户
  isUserProcess(processId: string): boolean {
    return this.getUserAgentProcessIds().includes(processId) || 
           this.currentConfig.chatroomProcessId === processId;
  }

  // 订阅配置变化
  onConfigChange(callback: (config: UserConfig) => void): () => void {
    this.configCallbacks.push(callback);
    
    // 返回取消订阅函数
    return () => {
      const index = this.configCallbacks.indexOf(callback);
      if (index > -1) {
        this.configCallbacks.splice(index, 1);
      }
    };
  }

  // 扩展：根据钱包地址查找用户配置
  // 未来可以从数据库或配置文件加载
  static getUserConfigByWallet(walletAddress: string): UserConfig {
    // 目前返回默认配置，但可以扩展为：
    // 1. 从数据库查询
    // 2. 从配置文件读取
    // 3. 从 AO 进程查询用户绑定的 agents
    
    console.log(`📋 Loading config for wallet: ${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`);
    
    return {
      ...DEFAULT_USER_CONFIG,
      walletAddress
    };
  }
}

export const userConfigManager = UserConfigManager.getInstance();

// 便捷函数
export const getCurrentUserConfig = () => userConfigManager.getCurrentConfig();
export const getUserAgentProcessIds = () => userConfigManager.getUserAgentProcessIds();
export const isUserProcess = (processId: string) => userConfigManager.isUserProcess(processId); 