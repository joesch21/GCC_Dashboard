import React, { useState, useEffect } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { defineChain } from '@reown/appkit/networks';
import { useAppKitAccount } from '@reown/appkit/react'; // Get wallet details
import ConnectButton from './components/ConnectButton';

const projectId = '8d7f0c0279b3e372faffa3cc0d66d835';
const metadata = {
  name: 'GCCDashboard',
  description: 'GCC Members Dashboard for token and NFT holders',
  url: 'https://gcc-bsc.online',
  icons: ['https://yourdomain.com/icon.png'],
};

// Define BSC Mainnet
const bscCustom = defineChain({
  id: 56,
  caipNetworkId: 'eip155:56',
  chainNamespace: 'eip155',
  name: 'BSC Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: ['https://bsc-dataseed.binance.org/'],
      webSocket: ['wss://bsc-ws-node.nariox.org:443'],
    },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
  contracts: {},
});

const networks = [bscCustom];

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: { analytics: true },
  chainImages: {
    56: '/bsc-logo.png',
  },
});

const API_BASE_URL = 'https://gcc-server-1.onrender.com';

export default function App() {
  const { address, isConnected } = useAppKitAccount();
  const [gccPrice, setGccPrice] = useState(null);
  const [gccBalance, setGccBalance] = useState(null);

  // Fetch GCC Price
  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gcc/price`);
        const data = await response.json();
        setGccPrice(data.price || 'N/A');
      } catch (error) {
        console.error('Error fetching GCC price:', error);
      }
    }
    fetchPrice();
  }, []);

  // Fetch User’s GCC Balance if Connected
  useEffect(() => {
    if (isConnected) {
      async function fetchBalance() {
        try {
          const response = await fetch(`${API_BASE_URL}/api/gcc/balance/${address}`);
          const data = await response.json();
          setGccBalance(data.balance || 'N/A');
        } catch (error) {
          console.error('Error fetching GCC balance:', error);
        }
      }
      fetchBalance();
    }
  }, [isConnected, address]);

  return (
    <div>
      <h1>Welcome to GCC Dashboard</h1>
      
      {isConnected ? (
        <div>
          <p>Wallet: {address}</p>
          <p>GCC Balance: {gccBalance || 'Loading...'}</p>
        </div>
      ) : (
        <p>Connect your wallet to view GCC balance.</p>
      )}
      <p>GCC Price: {gccPrice || 'Loading...'}</p>
    </div>
  );
}
