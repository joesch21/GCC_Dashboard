// src/main.jsx
import { EventEmitter } from 'events';

// Patch EventEmitter to include "off" if it's not already available
if (typeof EventEmitter.prototype.off !== 'function') {
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './config/appkit';  // Ensure AppKit is initialized before rendering
import './index.css';

// Ensure we only call ReactDOM.createRoot once
const root = document.getElementById('root');

if (!root) {
  console.error('Error: Root element not found.');
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
      <appkit-button /> {/* Wallet connect button */}
    </React.StrictMode>
  );
}
