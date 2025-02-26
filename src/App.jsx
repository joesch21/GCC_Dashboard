import React, { useState, useEffect } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { defineChain } from '@reown/appkit/networks';
import { useAppKitAccount } from '@reown/appkit/react'; // Get wallet details
import ConnectButton from './components/ConnectButton';

// ------------------ APPKIT CONFIG ------------------
const projectId = '8d7f0c0279b3e372faffa3cc0d66d835';
const metadata = {
  name: 'GCCDashboard',
  description: 'GCC Members Dashboard for token and NFT holders',
  url: 'https://gcc-bsc.online',
  icons: ['https://yourdomain.com/icon.png'],
};

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

// ------------------ API ENDPOINTS ------------------
const API_BASE_URL = 'https://gcc-server-1.onrender.com';

export default function App() {
  const { address, isConnected } = useAppKitAccount();
  const [gccPrice, setGccPrice] = useState(null);
  const [gccBalance, setGccBalance] = useState(null);
  const [gccVolumeData, setGccVolumeData] = useState(null);

  // ------------------ Fetch GCC Price ------------------
  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gcc/price`);
        const data = await response.json();

        // data might look like { success: true, dexPrice: "0.018...", bscPrice: "Not available" }
        if (data.success) {
          // Show both Dex & BscScan price if available
          setGccPrice(
            `DexScreener: ${data.dexPrice}, BscScan: ${data.bscPrice}`
          );
        } else {
          setGccPrice('N/A');
        }
      } catch (error) {
        console.error('Error fetching GCC price:', error);
        setGccPrice('Error');
      }
    }
    fetchPrice();
  }, []);

  // ------------------ Fetch GCC Volume Data ------------------
  useEffect(() => {
    async function fetchVolume() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gcc/volume`);
        const json = await response.json();

        // json might look like { success: true, data: { volume24hUsd: ..., gccTradedVolume: ... } }
        if (json.success) {
          setGccVolumeData(json.data); // store the entire data object
        } else {
          setGccVolumeData(null);
        }
      } catch (error) {
        console.error('Error fetching GCC volume data:', error);
        setGccVolumeData(null);
      }
    }
    fetchVolume();
  }, []);

  // ------------------ Fetch User’s GCC Balance if Connected ------------------
  useEffect(() => {
    if (!isConnected) return;

    async function fetchBalance() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/gcc/balance/${address}`
        );
        const data = await response.json();
        setGccBalance(data.balance || 'N/A');
      } catch (error) {
        console.error('Error fetching GCC balance:', error);
        setGccBalance('Error');
      }
    }

    fetchBalance();
  }, [isConnected, address]);

  // ------------------ Render ------------------
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Welcome to GCC Dashboard</h1>
      <ConnectButton />

      {/* Wallet Connection */}
      {isConnected ? (
        <div>
          <p>Wallet Address: {address}</p>
          <p>GCC Balance: {gccBalance || 'Loading...'}</p>
        </div>
      ) : (
        <p>Connect your wallet to view your GCC balance.</p>
      )}

      {/* GCC Price */}
      <p style={{ marginTop: '1rem' }}>
        <strong>GCC Price: </strong>
        {gccPrice || 'Loading...'}
      </p>

      {/* Volume Data from Flask */}
      {gccVolumeData ? (
        <div style={{ marginTop: '1rem' }}>
          <h2>24h Volume Data</h2>
          <p><strong>Price (USD):</strong> {gccVolumeData.priceUsd?.toFixed(6)}</p>
          <p><strong>24h Trading Volume (USD):</strong> {gccVolumeData.volume24hUsd?.toFixed(6)}</p>
          <p><strong>Traded Volume (GCC):</strong> {gccVolumeData.gccTradedVolume?.toFixed(6)}</p>
          <p><strong>Reward for Token Holders (1%):</strong> {gccVolumeData.rewardTokenHolders?.toFixed(6)} GCC</p>
          <p><strong>Reward for NFT Holders (1%):</strong> {gccVolumeData.rewardNFTHolders?.toFixed(6)} GCC</p>
        </div>
      ) : (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          No volume data available yet. Please check back later.
        </p>
      )}
    </div>
  );
}
