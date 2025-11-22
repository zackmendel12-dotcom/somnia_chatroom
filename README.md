# Somnia On-Chain Chat

> **Somnia Data Streams Mini Hackathon Submission** (Nov 4-15, 2025)

A decentralized, real-time chat application built on the Somnia blockchain, demonstrating the power of **Somnia Data Streams (SDS)** for building reactive, on-chain applications. This project showcases how SDS enables live data streaming, schema registration, and real-time message broadcasting entirely on-chain.

## 🎯 Hackathon Highlights

This application demonstrates several key capabilities of Somnia Data Streams:

- **✅ Live Data Streaming**: Messages are published on-chain using SDS and streamed in real-time to all connected clients
- **✅ Schema Registration**: Dynamic schema registration for structured chat data (timestamp, roomId, content, senderName, sender)
- **✅ Reactive Updates**: Client-side polling of on-chain data with instant UI updates when new messages arrive
- **✅ Multi-Room Support**: Multiple chat rooms with independent data streams, each using unique schema IDs
- **✅ On-Chain Storage**: All messages are immutably stored on the Somnia blockchain
- **✅ Server-Side SDK Integration**: Demonstrates proper server-side usage of @somnia-chain/streams

## 📹 Demo Video

> **Coming Soon**: [Link to 3-5 minute demo video will be added here]

## 🏗️ Architecture Overview

This application uses a **client/server architecture** to properly integrate Somnia Data Streams:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Browser)                      │
│  React + TypeScript + RainbowKit + wagmi                       │
│                                                                 │
│  • Wallet connection UI                                         │
│  • Chat interface with real-time updates                       │
│  • HTTP client (somniaService.ts) - NO direct SDS usage       │
│                                                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP/REST API
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    Backend (Express Server)                     │
│  Node.js + @somnia-chain/streams SDK                           │
│                                                                 │
│  • Schema registration (registerDataSchemas)                    │
│  • Message publishing (set with encoded payloads)              │
│  • Message retrieval (get with schema filtering)               │
│  • Room management (JSON file storage)                         │
│                                                                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ Somnia Data Streams SDK
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                     Somnia Blockchain                           │
│                                                                 │
│  • On-chain schema registry                                     │
│  • Immutable message storage                                    │
│  • Live data streams                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why Client/Server Split?

The Somnia Data Streams SDK (`@somnia-chain/streams`) requires a wallet with private keys to sign transactions. For security reasons, we handle all blockchain operations server-side:

- **Frontend**: Focuses on UI/UX, wallet connection (read-only), and displaying data
- **Backend**: Manages all SDS operations using a server wallet to sign transactions

### SDS Integration Points

#### 1. Schema Registration (`POST /api/streams/register-schema`)

When a user creates a chat room, the backend:
- Checks if the schema is already registered using `sdk.streams.isDataSchemaRegistered()`
- If not, registers it using `sdk.streams.registerDataSchemas()` with the chat schema definition
- Returns the transaction hash for confirmation

**Schema Definition:**
```typescript
uint64 timestamp,bytes32 roomId,string content,string senderName,address sender
```

#### 2. Message Publishing (`POST /api/streams/publish-message`)

When a user sends a message:
- Backend encodes the message data using `SchemaEncoder`
- Creates a unique data ID using `keccak256` hash
- Publishes to SDS using `sdk.streams.set()` with the encoded payload
- Waits for transaction confirmation
- Returns transaction hash to client

#### 3. Message Retrieval (`GET /api/streams/messages/:roomId`)

To display messages:
- Backend queries SDS using `sdk.streams.get()` with schema filtering
- Filters results by roomId (stored in the data payload)
- Decodes messages using `SchemaEncoder.decodeData()`
- Returns structured message array to frontend

#### 4. Real-Time Polling

The frontend polls the backend every 5 seconds:
- Fetches latest messages from the GET endpoint
- Compares against seen messages using in-memory Set
- Displays only new messages with smooth animations
- Maintains message order and deduplication

## ✨ Features

- 🔐 **Wallet Integration**: Connect via RainbowKit with support for multiple wallets
- 💬 **Chat Rooms**: Create and join multiple chat rooms with custom schema IDs
- 👤 **Display Names**: Set custom display names (stored per wallet in localStorage)
- 📝 **On-Chain Messages**: All messages are published to Somnia Streams
- 🔄 **Real-Time Updates**: Automatic polling for new messages (5s intervals)
- 💾 **Persistent State**: Last room and display names saved in localStorage
- ♿ **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support
- 📱 **Responsive**: Fluid layout from 320px mobile to widescreen (1536px+)
- 🎨 **Modern UI**: Tailwind CSS v4 design system with light/dark mode
- 🎭 **Emoji Support**: Emoji picker for expressive messaging

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- A Web3 wallet (e.g., MetaMask, WalletConnect-compatible wallet)
- STT tokens on Somnia Testnet (get from [faucet](https://faucet.somnia.network))
- WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### Environment Setup

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

4. **Update `.env` with your configuration:**
   
   Required variables:
   - `VITE_SOMNIA_RPC_URL`: Somnia testnet RPC URL (default: https://dream-rpc.somnia.network)
   - `VITE_SOMNIA_CHAIN_ID`: Chain ID (default: 50312 for testnet)
   - `VITE_SOMNIA_SCHEMA_ID`: Default chat schema ID (32-byte hex string)
   - `VITE_CHAT_SCHEMA`: Schema definition (uint64 timestamp,bytes32 roomId,string content,string senderName,address sender)
   - `VITE_RAINBOWKIT_PROJECT_ID`: Your WalletConnect project ID
   - `PRIVATE_KEY`: Server-side private key for blockchain operations (⚠️ **NEVER commit this!**)
   - `SERVER_PORT`: Backend port (default: 4000)
   - `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:4000)

   See [ENV_SETUP.md](./ENV_SETUP.md) for detailed setup instructions.

### Run the Application

Start both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:4000 (Express API server)

Open http://localhost:3000 in your browser.

### Run Components Separately

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

## 🎮 How to Use

### 1. Connect Your Wallet

- Click "Connect Wallet" in the top right corner
- Select your preferred wallet provider (MetaMask, WalletConnect, etc.)
- Approve the connection request
- Ensure you're connected to Somnia Testnet (chain ID: 50312)

### 2. Create or Join a Room

**Create a New Room:**
1. Click "Browse Rooms" to open the room modal
2. Switch to the "Create Room" tab
3. Enter a room name (e.g., "general", "dev-chat", "announcements")
4. The schema ID will be pre-filled from your .env file
5. Click "Create Room"
6. The backend will register the schema on-chain if needed

**Join an Existing Room:**
1. Open the room modal by clicking the room name in the header
2. Browse available rooms in the "Join Room" tab
3. Click on any room to join it

### 3. Set Your Display Name

- After connecting, click on your display name in the header
- Enter a custom name (stored per wallet address)
- Your display name appears on all your messages

### 4. Send Messages

- Type your message in the input field at the bottom
- Click the emoji button to add emojis
- Press Enter or click the send button
- Messages are published on-chain via Somnia Data Streams
- All users in the room will see your message within ~5 seconds

### 5. Switch Rooms

- Click the room name (e.g., "#general") in the header
- Select a different room from the modal
- Your last room is saved and automatically loaded on next visit

## 📁 Project Structure

```
.
├── components/              # React components
│   ├── layout/             # Layout components (LayoutShell, UtilityBar, ChatContainer)
│   ├── shared/             # Shared UI components (EmptyState, LoadingState)
│   ├── ui/                 # Reusable UI components (Modal, Badge, etc.)
│   ├── Header.tsx          # Navigation header with wallet connection
│   ├── ChatBubble.tsx      # Individual message display
│   ├── MessageInput.tsx    # Message composition with emoji picker
│   ├── RoomModal.tsx       # Create/join room modal
│   ├── DisplayNameModal.tsx # Edit display name modal
│   ├── EmojiPicker.tsx     # Emoji picker integration
│   └── TypingIndicator.tsx # Typing animation
├── services/               # Business logic
│   └── somniaService.ts    # HTTP client for SDS operations
├── server/                 # Express backend (ALL SDS integration here)
│   └── index.ts            # REST API + Somnia Streams SDK usage
├── src/
│   ├── config/             # Configuration and environment helpers
│   ├── hooks/              # Custom React hooks
│   ├── providers/          # React providers (Wagmi, Theme)
│   ├── styles/             # CSS and design tokens
│   └── App.tsx             # Main app component
├── docs/                   # Documentation
│   └── design-system.md    # Design system documentation
├── constants.ts            # Environment variable exports
├── types.ts                # TypeScript type definitions
├── .env.example            # Environment variable template
└── README.md               # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Run both client and server concurrently
- `npm run dev:client` - Run frontend only (port 3000)
- `npm run dev:server` - Run backend only (port 4000)
- `npm run build` - Build both client and server for production
- `npm run build:client` - Build frontend only
- `npm run build:server` - Build backend only
- `npm run test` - Run tests with Vitest (includes accessibility tests)
- `npm run test:watch` - Run tests in watch mode
- `npm run typecheck` - Run TypeScript type checking

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling with design tokens
- **styled-components** - Component-level styling
- **RainbowKit** - Wallet connection UI
- **wagmi** - Ethereum hooks
- **viem** - Ethereum client
- **framer-motion** - Animations with reduced-motion support
- **emoji-picker-react** - Emoji selection

### Backend
- **Express** - REST API server
- **Node.js** - Runtime
- **@somnia-chain/streams** - Somnia Data Streams SDK (**KEY INTEGRATION**)
- **viem** - Blockchain client
- **SchemaEncoder** - Data encoding/decoding for SDS

### Testing
- **Vitest** - Test runner
- **Testing Library** - Component testing
- **jest-axe** - Accessibility testing

### Storage
- **localStorage** - Client-side (display names, last room)
- **JSON file** - Server-side (room registry)
- **Somnia Blockchain** - On-chain (messages, schemas)

## 📚 Documentation

- **[README.md](./README.md)** - This file (getting started, architecture, usage)
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Detailed environment variable setup
- **[ACCESSIBILITY.md](./ACCESSIBILITY.md)** - WCAG 2.1 AA compliance guide
- **[docs/design-system.md](./docs/design-system.md)** - Design system documentation
- **[REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md)** - Technical architecture details
- **[EMOJI_PICKER.md](./EMOJI_PICKER.md)** - Emoji picker integration docs
- **[HEADER_VISIBILITY_FIX.md](./HEADER_VISIBILITY_FIX.md)** - Layout fixes documentation

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Accessibility Tests

```bash
npm test -- a11y.test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Type Checking

```bash
npm run typecheck
```

## 🐛 Troubleshooting

### Messages Not Appearing

- **Solution**: Ensure you have STT tokens in your wallet for gas fees
- **Check**: Verify the schema ID is correctly registered (check backend logs)
- **Check**: Verify RPC URL is working in `.env` file
- **Check**: Backend server is running and accessible at http://localhost:4000

### Cannot Connect Wallet

- **Solution**: Make sure you have a Web3 wallet extension installed (MetaMask, etc.)
- **Check**: Wallet is connected to Somnia Testnet (chain ID: 50312)
- **Check**: `VITE_RAINBOWKIT_PROJECT_ID` is set in `.env` file
- **Tip**: Get a free project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### Backend Connection Errors

- **Check**: Backend server is running on port 4000 (or your configured port)
- **Check**: CORS settings in `server/index.ts` allow your frontend origin
- **Check**: `VITE_ORIGIN` environment variable matches your frontend URL
- **Check**: `PRIVATE_KEY` is set correctly (without 0x prefix or with it, both work)

### Schema Registration Fails

- **Check**: Server wallet has STT tokens for gas fees
- **Check**: `VITE_CHAT_SCHEMA` is correctly formatted in `.env`
- **Check**: Backend logs for detailed error messages
- **Tip**: Run `curl http://localhost:4000/health` to check if Somnia SDK initialized

### Build Failures

- **Solution**: Run `npm install` to ensure all dependencies are installed
- **Check**: Node.js version is 16 or higher
- **Check**: TypeScript files have no type errors: `npm run typecheck`

## 🏆 Key SDS Features Demonstrated

This hackathon submission showcases:

1. **Schema Registration** - Dynamic on-chain schema registration for structured data
2. **Data Publishing** - Publishing encoded data to Somnia Data Streams
3. **Data Retrieval** - Querying on-chain data with schema filtering
4. **Real-Time Updates** - Polling-based live updates (production apps could use WebSockets)
5. **Server-Side Integration** - Proper SDK usage on backend for security
6. **Structured Encoding** - SchemaEncoder for type-safe data serialization
7. **Multi-Schema Support** - Multiple chat rooms with independent schemas
8. **Transaction Confirmation** - Waiting for blockchain confirmations before UI updates

## 👥 Team & Contact

**Project Name**: Somnia On-Chain Chat

**Team**: [Your Team Name]

**Contact**: [Your Email or GitHub]

**Repository**: [GitHub Repository URL]

**Demo Video**: [Video URL - Coming Soon]

**Hackathon**: Somnia Data Streams Mini Hackathon (Nov 4-15, 2025)

---

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Somnia Network** for the Data Streams SDK and comprehensive documentation
- **RainbowKit** for beautiful wallet connection UI
- **Viem** for modern Ethereum library
- The Somnia developer community for support and feedback

---

## 🔗 Useful Links

- [Somnia Documentation](https://docs.somnia.network/)
- [Somnia Data Streams](https://docs.somnia.network/somnia-data-streams)
- [Somnia Testnet Faucet](https://faucet.somnia.network)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [Somnia Discord](https://discord.gg/somnia)

---

**Built with ❤️ for the Somnia Data Streams Mini Hackathon**
