# Somnia On-Chain Chat

> **Somnia Data Streams Mini Hackathon Submission** (Nov 4-15, 2025)

A decentralized, real-time chat application built on the Somnia blockchain, demonstrating the power of **Somnia Data Streams (SDS)** for building reactive, on-chain applications.

## 📹 Demo Video

> **[Add your demo video link here]**

## 🎯 What is This?

This is a fully functional on-chain chat application that uses Somnia Data Streams to publish and stream messages in real-time. All chat messages are stored immutably on the Somnia blockchain and streamed live to connected clients.

### How Somnia Data Streams is Used

- **Live Message Streaming**: Messages are published on-chain using SDS and automatically appear for all connected users
- **Schema Registration**: Dynamic schema registration for structured chat data (timestamp, roomId, content, senderName, sender)
- **Multi-Room Support**: Create and join multiple chat rooms, each with independent data streams
- **Real-Time Updates**: Automatic polling retrieves new messages from the blockchain every 5 seconds
- **On-Chain Storage**: All messages are immutably stored on Somnia with cryptographic guarantees

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│      Frontend (React + TypeScript)       │
│  • Wallet connection UI                  │
│  • Chat interface                        │
│  • HTTP client (no direct SDS)          │
└──────────────┬───────────────────────────┘
               │ HTTP/REST
┌──────────────▼───────────────────────────┐
│    Backend (Express + SDS SDK)           │
│  • Schema registration                   │
│  • Message publishing                    │
│  • Message retrieval                     │
└──────────────┬───────────────────────────┘
               │ Somnia Data Streams SDK
┌──────────────▼───────────────────────────┐
│       Somnia Blockchain                  │
│  • On-chain schema registry              │
│  • Immutable message storage             │
└──────────────────────────────────────────┘
```

**Why client/server split?** The SDS SDK requires a wallet with private keys to sign transactions. For security, all blockchain operations are handled server-side.

## 🚀 Local Setup

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- A Web3 wallet (MetaMask, WalletConnect, etc.)
- STT tokens on Somnia Testnet - get from [faucet](https://faucet.somnia.network)
- WalletConnect Project ID - get from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd somnia_chatroom
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with required values:**
   
   ```bash
   # Somnia Network Configuration
   VITE_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
   VITE_SOMNIA_CHAIN_ID=50312
   
   # Schema Configuration (use provided default or create your own)
   VITE_SOMNIA_SCHEMA_ID=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   VITE_CHAT_SCHEMA=uint64 timestamp,bytes32 roomId,string content,string senderName,address sender
   
   # Wallet Integration
   VITE_RAINBOWKIT_PROJECT_ID=your_walletconnect_project_id_here
   
   # Server Configuration
   SERVER_PORT=4000
   VITE_API_BASE_URL=http://localhost:4000
   
   # Server Wallet (⚠️ NEVER commit this!)
   PRIVATE_KEY=your_private_key_here
   ```

   **Important**: 
   - Replace `your_walletconnect_project_id_here` with your WalletConnect project ID
   - Replace `your_private_key_here` with a private key for the server wallet (needs STT for gas)
   - The schema ID can be any 32-byte hex string (the app will register it on first use)

5. **Start the application:**
   ```bash
   npm run dev
   ```

   This starts:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:4000

6. **Open in browser:**
   Navigate to http://localhost:3000

### Run Components Separately

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

## 🎮 Testing the App

### 1. Connect Your Wallet

- Click **"Connect Wallet"** in the top right
- Select your wallet provider (MetaMask, WalletConnect, etc.)
- Approve the connection
- Ensure you're on Somnia Testnet (chain ID: 50312)

### 2. Create or Join a Room

**Create a New Room:**
1. Click **"Browse Rooms"**
2. Switch to the **"Create Room"** tab
3. Enter a room name (e.g., "general", "dev-chat")
4. Schema ID is pre-filled from .env
5. Click **"Create Room"**
6. Backend registers the schema on-chain (requires STT for gas)

**Join an Existing Room:**
1. Open the room modal
2. Browse available rooms in the **"Join Room"** tab
3. Click on any room to join

### 3. Set Your Display Name

- Click on your wallet address in the header
- Enter a custom display name
- Saved per-wallet in browser localStorage

### 4. Send Messages and See Live Updates

- Type a message in the input field at the bottom
- Click the 😊 button to add emojis
- Press **Enter** or click **Send**
- Message is published on-chain via Somnia Data Streams
- All users in the room see your message within ~5 seconds
- Switch rooms to see messages automatically update

## 📁 Project Structure

```
.
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── shared/             # Shared UI (EmptyState, LoadingState)
│   ├── ui/                 # Reusable components (Modal, Badge, etc.)
│   └── *.tsx               # Chat components
├── services/               # HTTP client for SDS operations
│   └── somniaService.ts
├── server/                 # Express backend (ALL SDS integration)
│   └── index.ts            # REST API + Somnia Streams SDK
├── src/
│   ├── config/             # Configuration helpers
│   ├── hooks/              # Custom React hooks
│   ├── providers/          # React providers (Wagmi, Theme)
│   ├── styles/             # CSS and design tokens
│   └── App.tsx             # Main app component
├── constants.ts            # Environment exports
├── types.ts                # TypeScript types
├── .env.example            # Environment template
└── README.md               # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Run both client and server concurrently
- `npm run dev:client` - Run frontend only (port 3000)
- `npm run dev:server` - Run backend only (port 4000)
- `npm run build` - Build both client and server
- `npm run typecheck` - Run TypeScript type checking

## 🔧 Technology Stack

**Frontend:**
- React 19, TypeScript, Vite
- Tailwind CSS v4, styled-components
- RainbowKit, wagmi, viem
- framer-motion, emoji-picker-react

**Backend:**
- Express, Node.js
- **@somnia-chain/streams** (SDS SDK - key integration)
- viem, SchemaEncoder

## 🐛 Troubleshooting

### Messages Not Appearing

- Ensure you have STT tokens for gas fees
- Check backend logs for schema registration errors
- Verify RPC URL is correct in `.env`
- Confirm backend is running on http://localhost:4000

### Cannot Connect Wallet

- Install a Web3 wallet extension (MetaMask, etc.)
- Connect to Somnia Testnet (chain ID: 50312)
- Set `VITE_RAINBOWKIT_PROJECT_ID` in `.env`

### Backend Connection Errors

- Check backend server is running on port 4000
- Verify `VITE_API_BASE_URL=http://localhost:4000` in `.env`
- Ensure `PRIVATE_KEY` is set (server wallet needs STT tokens)
- Check server logs: backend prints initialization status on startup

### Schema Registration Fails

- Server wallet must have STT tokens for gas
- Verify `VITE_CHAT_SCHEMA` is correctly formatted
- Check backend logs for detailed error messages
- Run `curl http://localhost:4000/health` to verify SDK initialization

### Build Failures

- Run `npm install` to ensure dependencies are installed
- Check Node.js version is 16 or higher
- Run `npm run typecheck` to check for type errors

## 🏆 Key SDS Features Demonstrated

1. **Schema Registration** - Dynamic on-chain schema registration
2. **Data Publishing** - Publishing encoded data to SDS
3. **Data Retrieval** - Querying on-chain data with filtering
4. **Real-Time Updates** - Polling-based live message streaming
5. **Server-Side Integration** - Secure SDK usage on backend
6. **Structured Encoding** - SchemaEncoder for type-safe serialization
7. **Multi-Schema Support** - Multiple chat rooms with independent schemas

## 👥 Team & Contact

**Project Name**: Somnia On-Chain Chat

**Team**: [Your Team Name]

**Contact**: [Your Email or GitHub]

**Repository**: [GitHub Repository URL]

**Hackathon**: Somnia Data Streams Mini Hackathon (Nov 4-15, 2025)

---

## 🔗 Useful Links

- [Somnia Documentation](https://docs.somnia.network/)
- [Somnia Data Streams](https://docs.somnia.network/somnia-data-streams)
- [Somnia Testnet Faucet](https://faucet.somnia.network)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [Somnia Discord](https://discord.gg/somnia)

---

**Built with ❤️ for the Somnia Data Streams Mini Hackathon**
