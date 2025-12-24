export const config = {
  // Network configuration
  network: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
  
  // Contract configuration
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SP1C5DP9C9N2MB8DMZN18EJNSSA3GYNJE3DGN806V',
  contractName: process.env.NEXT_PUBLIC_CONTRACT_NAME || 'voting',
  
  // API endpoints
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.mainnet.hiro.so',
  
  // App configuration
  appName: 'Stacks Voting',
  appDescription: 'Decentralized voting platform on Stacks blockchain',
  
  // Feature flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    debugMode: process.env.NODE_ENV === 'development',
  },
};
