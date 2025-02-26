import React, { useState, useEffect } from 'react';
import './App.css'; // 1) import your new CSS
import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { defineChain } from '@reown/appkit/networks';
import { useAppKitAccount } from '@reown/appkit/react';
import ConnectButton from './components/ConnectButton';

// -- APPKIT CONFIG (same as before) --
const projectId = '8d7f0c0279b3e372faffa3cc0d66d835';
const metadata = {
  name: 'GCCDashboard',
  description: 'GCC Members Dashboard for token & NFT holders',
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

const API_BASE_URL = 'https://gcc-server-1.onrender.com';

export default function App() {
  const { address, isConnected } = useAppKitAccount();

  const [gccPrice, setGccPrice] = useState(null);
  const [gccBalance, setGccBalance] = useState(null);
  const [volumeData, setVolumeData] = useState(null);

  // 1) Fetch GCC Price
  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gcc/price`);
        const json = await res.json();
        if (json.success) {
          setGccPrice(`Dex: ${json.dexPrice}, Bsc: ${json.bscPrice}`);
        } else {
          setGccPrice('Price not found');
        }
      } catch (err) {
        console.error('Error fetching GCC price:', err);
        setGccPrice('Error');
      }
    }
    fetchPrice();
  }, []);

  // 2) Fetch GCC Volume
  useEffect(() => {
    async function fetchVolume() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gcc/volume`);
        const json = await res.json();
        if (json.success) {
          setVolumeData(json.data);
        } else {
          setVolumeData(null);
        }
      } catch (err) {
        console.error('Error fetching volume:', err);
        setVolumeData(null);
      }
    }
    fetchVolume();
  }, []);

  // 3) Fetch On-Chain GCC Balance
  useEffect(() => {
    if (!isConnected) return;

    async function fetchBalance() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gcc/balance/${address}`);
        const json = await res.json();
        if (json.success) {
          setGccBalance(json.balance);
        } else {
          setGccBalance('N/A');
        }
      } catch (err) {
        console.error('Error fetching GCC balance:', err);
        setGccBalance('Error');
      }
    }
    fetchBalance();
  }, [isConnected, address]);

  return (
    // 2) Add your container class
    <div className="dashboard-container">
      <h1>Welcome to GCC Dashboard</h1>

      {/* Center the ConnectButton if you like */}
      <div className="connect-btn-container">
        <ConnectButton />
      </div>

      {/* 1) Wallet Info */}
      {isConnected ? (
        <div className="info-card">
          <h2>Wallet Info</h2>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>GCC Balance:</strong> {gccBalance ?? 'Loading...'}</p>
        </div>
      ) : (
        <div className="info-card">
          <p>Please connect your wallet to view your GCC balance.</p>
        </div>
      )}

      {/* 2) GCC Price */}
      <div className="info-card">
        <h2>GCC Price</h2>
        <p><strong>Price:</strong> {gccPrice ?? 'Loading...'}</p>
      </div>

      {/* 3) Advanced Volume Data */}
      <div className="info-card">
        <h2>GCC 24h Volume Data</h2>
        {volumeData ? (
          <>
            <p><strong>Address:</strong> {volumeData.address}</p>
            <p><strong>Chain ID:</strong> {volumeData.chainId}</p>
            <p><strong>Price (USD):</strong> {volumeData.priceUsd?.toFixed(6)}</p>
            <p><strong>24h Trading Volume (USD):</strong> {volumeData.volume24hUsd?.toFixed(6)}</p>
            <p><strong>GCC Traded Volume (GCC):</strong> {volumeData.gccTradedVolume?.toFixed(6)}</p>
            <p><strong>Reward Token Holders (1%):</strong> {volumeData.rewardTokenHolders?.toFixed(6)} GCC</p>
            <p><strong>Reward NFT Holders (1%):</strong> {volumeData.rewardNFTHolders?.toFixed(6)} GCC</p>
            <p><strong>Price 24h Ago (USD):</strong> {volumeData.priceUsd24hAgo?.toFixed(6)}</p>
            <p><strong>Price 7d Ago (USD):</strong> {volumeData.priceUsd7dAgo?.toFixed(6)}</p>
            <p><strong>Total Reserve (USD):</strong> {volumeData.totalReserveUsd?.toFixed(2)}</p>
            <p><strong>Circulating Supply (USD):</strong> {volumeData.circulatingSupplyUsd?.toFixed(2)}</p>
            <p><strong>Market Cap (USD):</strong> {volumeData.marketCapUsd?.toFixed(2)}</p>
            <p><strong>Trades in Last 24h:</strong> {volumeData.trades24h}</p>
          </>
        ) : (
          <p className="text-muted">No volume data available yet.</p>
        )}
      </div>
    </div>
  );
}
