interface DeviceInfo {
  platform?: string;
  appVersion?: string;
  timestamp?: string;
  [key: string]: unknown; // Allow additional properties
}

interface DeviceToken {
  token: string;
  deviceInfo?: DeviceInfo; // Replace 'any' with proper type
  registeredAt: string;
}

// Use a global variable to persist data across API calls
const globalForTokens = globalThis as unknown as {
  tokenStorage: DeviceToken[] | undefined;
};

class TokenManager {
  private static instance: TokenManager;
  private tokens: DeviceToken[];

  constructor() {
    // Initialize from global storage or create new array
    this.tokens = globalForTokens.tokenStorage || [];
    globalForTokens.tokenStorage = this.tokens;
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  addToken(token: string, deviceInfo?: DeviceInfo): void { // Replace 'any' with DeviceInfo
    // Remove existing token if it exists
    this.tokens = this.tokens.filter((item: DeviceToken) => item.token !== token);
    
    // Add new token
    this.tokens.push({
      token,
      deviceInfo,
      registeredAt: new Date().toISOString()
    });

    // Update global storage
    globalForTokens.tokenStorage = this.tokens;
    
    console.log(`✅ Token registered: ${token.substring(0, 20)}... (${deviceInfo?.platform || 'Unknown'})`);
    console.log(`📱 Total devices: ${this.tokens.length}`);
  }

  getAllTokens(): DeviceToken[] {
    // Always get fresh data from global storage
    this.tokens = globalForTokens.tokenStorage || [];
    console.log(`🔍 Retrieved ${this.tokens.length} tokens from storage`);
    return this.tokens;
  }

  getTokenCount(): number {
    this.tokens = globalForTokens.tokenStorage || [];
    return this.tokens.length;
  }

  removeToken(token: string): void {
    this.tokens = this.tokens.filter((item: DeviceToken) => item.token !== token);
    globalForTokens.tokenStorage = this.tokens;
  }
}

export default TokenManager;
export type { DeviceToken, DeviceInfo };