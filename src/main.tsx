import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiProvider } from './providers/WagmiProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import './styles/tailwind.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <WagmiProvider>
        <App />
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
