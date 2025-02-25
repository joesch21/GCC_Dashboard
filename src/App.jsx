// src/App.jsx
import React from 'react'
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { defineChain } from '@reown/appkit/networks'
import ConnectButton from './components/ConnectButton'

// Your Reown Cloud Project ID and metadata
const projectId = '8d7f0c0279b3e372faffa3cc0d66d835'
const metadata = {
  name: 'GCCDashboard',
  description: 'GCC Members Dashboard for token and NFT holders',
  url: 'https://gcc-bsc.online', // Must match your verified domain
  icons: ['https://yourdomain.com/icon.png']
}

// Define BSC Mainnet as a custom chain using defineChain
const bscCustom = defineChain({
  id: 56,
  caipNetworkId: 'eip155:56', // CAIP-2 compliant ID for BSC
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
      webSocket: ['wss://bsc-ws-node.nariox.org:443'] // optional; ensure you have a valid endpoint
    }
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' }
  },
  contracts: {}
})

// Pass your custom network to AppKit via the networks array
const networks = [bscCustom]

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: { analytics: true },
  chainImages: {
    // Optionally set a custom logo for BSC (using chainId as key)
    56: '/bsc-logo.png'
  }
})

export default function App() {
  return (
    <div>
      <h1>Welcome to GCC Dashboard</h1>
      
      {/* Add other components or routes here */}
    </div>
  )
}
