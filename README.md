# Somnia On-Chain Chat

A decentralized chat application built on the Somnia blockchain network. Connect your wallet, create or join chat rooms, and send messages that are stored immutably on-chain using Somnia Streams.

## Features

- 🔐 **Wallet Integration**: Connect via RainbowKit with support for multiple wallets
- 💬 **Chat Rooms**: Create and join multiple chat rooms with custom schema IDs
- 👤 **Display Names**: Set custom display names (stored per wallet in localStorage)
- 📝 **On-Chain Messages**: All messages are published to Somnia Streams
- 🔄 **Real-Time Updates**: Automatic polling for new messages
- 💾 **Persistent State**: Last room and display names saved in localStorage

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- A Web3 wallet (e.g., MetaMask, WalletConnect-compatible wallet)
- STT tokens on Somnia Testnet (for sending messages)

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration:
   - `VITE_SOMNIA_RPC_URL`: Somnia testnet RPC URL
   - `VITE_SOMNIA_CHAIN_ID`: Somnia chain ID (typically 50312 for testnet)
   - `VITE_SOMNIA_SCHEMA_ID`: Default chat schema ID (32-byte hex)
   - `VITE_CHAT_SCHEMA`: Chat schema definition
   - `VITE_RAINBOWKIT_PROJECT_ID`: Your WalletConnect project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - `PRIVATE_KEY`: Server-side private key for blockchain operations
   - `SERVER_PORT`: Backend server port (default: 4000)

For detailed environment setup, see [ENV_SETUP.md](./ENV_SETUP.md)

## Run Locally

### Install Dependencies

```bash
npm install
```

### Start Both Frontend and Backend

Run both the Vite dev server (frontend) and Express server (backend) concurrently:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:4000 (Express API server)

### Run Frontend Only

```bash
npm run dev:client
```

### Run Backend Only

```bash
npm run dev:server
```

## How to Create a Chat Room

### Option 1: Via the UI (Recommended)

1. **Connect Your Wallet**:
   - Click "Connect Wallet" in the top right corner
   - Select your preferred wallet provider
   - Approve the connection request

2. **Create a Room**:
   - After connecting, you'll see the room selection screen
   - Click "Browse Rooms" to open the room modal
   - Switch to the "Create Room" tab
   - Enter a room name (e.g., "general", "announcements", "dev-chat")
   - The schema ID will be pre-filled with the default from your `.env` file
   - Click "Create Room"

3. **Join an Existing Room**:
   - Open the room modal by clicking the room name in the header
   - Browse available rooms in the "Join Room" tab
   - Click on any room to join it

### Option 2: Via API (For Developers)

Create a room using the backend API:

```bash
curl -X POST http://localhost:4000/api/create-room \
  -H "Content-Type: application/json" \
  -d '{
    "roomName": "my-room",
    "schemaId": "0x0000000000000000000000000000000000000000000000000000000000000001"
  }'
```

List all rooms:

```bash
curl http://localhost:4000/api/rooms
```

Get a specific room:

```bash
curl http://localhost:4000/api/rooms/my-room
```

## How to Use the Chat

1. **Set Your Display Name**:
   - After connecting, your wallet address is used as the default display name
   - Click on your display name in the header to change it
   - The display name is stored per wallet address in localStorage

2. **Send Messages**:
   - Type your message in the input field at the bottom
   - Press Enter or click the send button
   - Messages are published on-chain and appear in real-time

3. **Switch Rooms**:
   - Click the room name (e.g., "#general") in the header
   - Select a different room from the modal
   - Your last room is saved and automatically loaded on next visit

## Project Structure

```
.
├── components/          # React components
│   ├── Header.tsx       # Navigation header with wallet connection
│   ├── ChatBubble.tsx   # Individual message display
│   ├── MessageInput.tsx # Message composition input
│   ├── RoomModal.tsx    # Create/join room modal
│   └── DisplayNameModal.tsx # Edit display name modal
├── services/            # Business logic
│   └── somniaService.ts # Somnia Streams integration
├── src/
│   ├── config/          # Configuration utilities
│   ├── hooks/           # React hooks
│   └── providers/       # React providers (Wagmi, RainbowKit)
├── server/              # Express backend
│   └── index.ts         # REST API for room management
├── App.tsx              # Main app component
└── types.ts             # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Run both client and server
- `npm run dev:client` - Run frontend only (port 3000)
- `npm run dev:server` - Run backend only (port 4000)
- `npm run build` - Build both client and server for production
- `npm run test` - Run tests with Vitest
- `npm run typecheck` - Run TypeScript type checking

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, styled-components
- **Animation**: framer-motion with reduced-motion support
- **Blockchain**: Somnia Network, viem, @somnia-chain/streams
- **Wallet**: RainbowKit, wagmi
- **Backend**: Express, Node.js
- **Storage**: localStorage (client-side), JSON file (server-side)
- **Testing**: Vitest, Testing Library

## Troubleshooting

### Messages Not Appearing

- Ensure you have STT tokens in your wallet for gas fees
- Check that the schema ID is correctly registered
- Verify your RPC URL is working in the `.env` file

### Cannot Connect Wallet

- Make sure you have a Web3 wallet extension installed
- Check that your wallet is connected to the Somnia Testnet
- Verify the `VITE_RAINBOWKIT_PROJECT_ID` in your `.env` file

### Backend Connection Errors

- Ensure the backend server is running on port 4000
- Check CORS settings in `server/index.ts`
- Verify the `VITE_ORIGIN` environment variable matches your frontend URL

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the [ENV_SETUP.md](./ENV_SETUP.md) for environment configuration
- Review the [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md) for technical details
- Open an issue on GitHub for bugs and feature requests
