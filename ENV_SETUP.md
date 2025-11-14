# Environment Setup Guide

This document describes the environment configuration setup for the Somnia On-Chain Chat application.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your actual values for:
   - `VITE_PRIVATE_KEY` - Your wallet private key (without 0x prefix)
   - `VITE_RAINBOWKIT_PROJECT_ID` - Your RainbowKit project ID from https://cloud.walletconnect.com
   - `GEMINI_API_KEY` - Your Gemini API key (if using AI features)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application:
   ```bash
   npm run dev
   ```

## Environment Variables

### Client-Side Variables (VITE_ prefix)
These variables are exposed to the frontend application:

- `VITE_SOMNIA_RPC_URL` - RPC URL for Somnia network
- `VITE_SOMNIA_CHAIN_ID` - Somnia chain ID (e.g., 50312 for testnet)
- `VITE_SOMNIA_SCHEMA_ID` - Schema ID for Somnia Streams
- `VITE_CHAT_SCHEMA` - Chat schema definition
- `VITE_PRIVATE_KEY` - Wallet private key
- `VITE_RAINBOWKIT_PROJECT_ID` - RainbowKit project ID

### Server-Side Variables
These variables are only available to the backend:

- `SOMNIA_API_BASE_URL` - Base URL for backend API
- `SERVER_PORT` - Port for Express server
- `GEMINI_API_KEY` - Gemini AI API key

## Configuration Helpers

### Client-Side Configuration
Use the typed configuration helper for validated environment access:

```typescript
import { getConfig } from '@/src/config/env';

const config = getConfig();
console.log(config.somnia.rpcUrl);
```

### Direct Access
Or access directly via `import.meta.env`:

```typescript
const rpcUrl = import.meta.env.VITE_SOMNIA_RPC_URL;
```

### Server-Side Access
In server code, use standard Node.js environment access:

```typescript
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.SERVER_PORT || 3001;
```

## NPM Scripts

### Development
- `npm run dev` - Run both client and server concurrently
- `npm run dev:client` - Run only the Vite dev server (port 3000)
- `npm run dev:server` - Run only the Express server

### Build
- `npm run build` - Build both client and server
- `npm run build:client` - Build only the client
- `npm run build:server` - Build only the server

### Testing
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Other
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Security Notes

1. **Never commit `.env` files** - They are automatically ignored by `.gitignore`
2. **Use separate keys for development and production**
3. **Keep your private keys secure** - Never share them or commit them to version control
4. **Rotate keys regularly** - Especially if you suspect they may have been compromised

## Type Safety

All environment variables are typed via `vite-env.d.ts`. The config helper at `src/config/env.ts` provides runtime validation and will throw informative errors in development if required variables are missing.

## Troubleshooting

### "Missing required environment variable" error
- Check that your `.env` file exists
- Verify all required variables are set in `.env`
- Make sure variable names match exactly (including the `VITE_` prefix for client-side vars)

### Type errors with import.meta.env
- Ensure `vite/client` is in your `tsconfig.json` types array
- Check that `vite-env.d.ts` exists and includes the variable definition

### Variables not updating
- Restart the dev server after changing `.env` files
- Vite only loads environment variables at startup
