# Somnia Service

A modular SDK adapter for interacting with the Somnia blockchain and Somnia Streams.

## Features

- **No hardcoded private keys**: Accepts wallet clients from wagmi or server-side wallets
- **Schema registration**: Register chat schemas on-chain
- **Message publishing**: Publish messages to rooms with schema validation
- **Message retrieval**: Fetch messages filtered by room ID
- **Real-time subscriptions**: Poll for new messages with automatic deduplication

## Usage

### Client-Side (with wagmi)

```typescript
import { useSomniaService } from '../src/hooks/useSomniaService';

function MyComponent() {
  const somniaService = useSomniaService();
  const { address } = useAccount();
  
  // Register schema
  useEffect(() => {
    if (somniaService) {
      somniaService.registerChatSchema(SCHEMA_ID)
        .then(() => console.log('Schema registered'))
        .catch(console.error);
    }
  }, [somniaService]);
  
  // Publish message
  const sendMessage = async (text: string) => {
    if (somniaService) {
      await somniaService.publishMessage(
        text,
        'Username',
        'room-id',
        SCHEMA_ID
      );
    }
  };
  
  // Subscribe to messages
  useEffect(() => {
    if (somniaService && address) {
      somniaService.subscribeToMessages(
        (newMessages) => setMessages(prev => [...prev, ...newMessages]),
        SCHEMA_ID,
        'room-id',
        address,
        'Username'
      );
      
      return () => somniaService.unsubscribe();
    }
  }, [somniaService, address]);
}
```

### Server-Side (with private key)

```typescript
import { createServiceWithPrivateKey } from './services/somniaService';
import { Hex } from 'viem';

const service = createServiceWithPrivateKey(
  process.env.PRIVATE_KEY!,
  process.env.RPC_URL
);

// Register schema
const txHash = await service.registerChatSchema(schemaId as Hex);

// Publish message
await service.publishMessage(
  'Hello world',
  'ServerBot',
  'general',
  schemaId as Hex
);

// Get room messages
const messages = await service.getRoomMessages(
  schemaId as Hex,
  'general',
  publisherAddress as Hex
);
```

## API

### `SomniaService`

#### Constructor

```typescript
new SomniaService(config: SomniaServiceConfig)
```

**Parameters:**
- `config.walletClient`: WalletClient from viem or wagmi
- `config.publicClient`: (Optional) PublicClient for reading blockchain data
- `config.rpcUrl`: (Optional) RPC URL if no publicClient provided

#### Methods

##### `registerChatSchema(schemaId: Hex, schema?: string): Promise<Hex | null>`

Register a chat schema on-chain.

**Returns:** Transaction hash if registered, null if already registered

##### `getRoomMessages(schemaId: Hex, roomId: string, publisherAddress: Address, currentUser?: string): Promise<Message[]>`

Fetch all messages for a specific room, sorted by timestamp.

##### `publishMessage(text: string, senderName: string, roomId: string, schemaId: Hex): Promise<Hex>`

Publish a message to a room.

**Returns:** Transaction hash

##### `subscribeToMessages(callback: MessageCallback, schemaId: Hex, roomId: string, publisherAddress: Address, currentUser: string, pollIntervalMs?: number): void`

Subscribe to new messages with polling. Automatically deduplicates messages.

**Default poll interval:** 5000ms

##### `unsubscribe(): void`

Stop polling for new messages.

## Factory Functions

### `createServiceWithPrivateKey(privateKey: string, rpcUrl?: string): SomniaService`

Create a service instance using a private key (for server-side use).

### `createServiceWithWalletClient(walletClient: WalletClient, publicClient?: PublicClient): SomniaService`

Create a service instance using a wallet client (for client-side use with wagmi).

## Testing

Tests are included in `somniaService.test.ts` covering:
- New schema registration
- Already-registered schema handling
- Error propagation
- Transaction receipt waiting
- Signer requirements

Run tests with:
```bash
npm test
```
