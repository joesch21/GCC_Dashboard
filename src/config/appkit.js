// src/config/appkit.js
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { defineChain } from '@reown/appkit/networks';

// Replace with your actual Reown Cloud Project ID
const projectId = '8d7f0c0279b3e372faffa3cc0d66d835';

// Metadata for wallet verification
const metadata = {
  name: 'GCC ',
  description: 'GCC Members  for token and NFT holders on BSC',
  url: 'https://gcc-bsc.online',
  icons: ['https://yourdomain.com/icon.png']
};

// Define BSC Mainnet
export const bsc = defineChain({
  id: 56,
  caipNetworkId: 'eip155:56',
  chainNamespace: 'eip155',
  name: 'BNB Smart Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: ['https://bsc-dataseed.binance.org/'],
      webSocket: ['wss://bsc-ws-node.nariox.org:443'],
    }
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' }
  },
  contracts: {}
});

// Create Ethers adapter
const ethersAdapter = new EthersAdapter();

// Initialize AppKit
createAppKit({
  adapters: [ethersAdapter],
  networks: [bsc], // Use BSC instead of Ethereum
  metadata,
  projectId,
  features: {
    analytics: true
  }
});
