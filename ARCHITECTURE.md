# Somnia Data Streams Integration Architecture

This document explains how Somnia Data Streams (SDS) is integrated into the chat application and provides technical details for developers and hackathon judges.

## Table of Contents

- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Client/Server Split](#clientserver-split)
- [SDS Integration Points](#sds-integration-points)
- [Data Flow](#data-flow)
- [Schema Design](#schema-design)
- [Security Considerations](#security-considerations)
- [Performance Optimizations](#performance-optimizations)
- [Future Improvements](#future-improvements)

## Overview

This application demonstrates a production-ready architecture for integrating Somnia Data Streams into a web application. The key innovation is the **client/server split**, where all blockchain operations are handled server-side for security and simplicity.

### Why This Architecture?

1. **Security**: Private keys never leave the server
2. **Simplicity**: Frontend developers don't need blockchain expertise
3. **Performance**: Server can batch operations and implement caching
4. **Control**: Server can validate, rate-limit, and moderate content
5. **Cost**: Server can optimize gas usage across multiple users

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Browser)                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  React UI    │  │  RainbowKit  │  │ HTTP Client  │        │
│  │  Components  │  │  (Wagmi)     │  │ (Somnia-     │        │
│  │              │  │              │  │  Service)    │        │
│  └──────────────┘  └──────────────┘  └──────┬───────┘        │
│                                              │                  │
│                                              │ HTTP/REST        │
└──────────────────────────────────────────────┼──────────────────┘
                                               │
                                               │
┌──────────────────────────────────────────────▼──────────────────┐
│                     Backend (Express)                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  REST API    │  │  Somnia SDK  │  │ Schema       │         │
│  │  Endpoints   │  │  (@somnia-   │  │ Encoder      │         │
│  │              │  │   chain/     │  │              │         │
│  │              │  │   streams)   │  │              │         │
│  └──────────────┘  └──────┬───────┘  └──────────────┘         │
│                           │                                      │
│                           │ SDK Methods                          │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                  Somnia Blockchain Network                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Schema      │  │  Data        │  │  Transaction │         │
│  │  Registry    │  │  Streams     │  │  History     │         │
│  │              │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Client/Server Split

### Frontend Responsibilities

The frontend (`services/somniaService.ts`) is a **thin HTTP client** that:

- Makes REST API calls to the backend
- Handles UI state management
- Polls for new messages (every 5 seconds)
- Deduplicates messages client-side
- Manages wallet connections (read-only, via RainbowKit)

**Key Point**: The frontend does NOT import `@somnia-chain/streams`. It has no knowledge of blockchain operations.

### Backend Responsibilities

The backend (`server/index.ts`) is where **all SDS integration happens**:

- Initializes the Somnia SDK with a server wallet
- Registers schemas on-chain
- Publishes messages to SDS
- Queries and decodes on-chain data
- Validates all inputs
- Handles transaction signing and confirmation

## SDS Integration Points

### 1. Schema Registration

**File**: `server/index.ts`, endpoint `POST /api/streams/register-schema`

**Purpose**: Register a data schema on the Somnia blockchain before publishing data.

**Process**:
```typescript
// 1. Check if schema already exists (saves gas)
const isRegistered = await somniaSDK.streams.isDataSchemaRegistered(schemaId);

// 2. If not registered, register it
if (!isRegistered) {
  const txHash = await somniaSDK.streams.registerDataSchemas([{
    id: schemaId,
    schema: "uint64 timestamp,bytes32 roomId,string content,string senderName,address sender",
    parentSchemaId: zeroBytes32
  }], true);
  
  // 3. Wait for transaction confirmation
  await publicClient.waitForTransactionReceipt({ hash: txHash });
}
```

**Why It Matters**: Schemas define the structure of data stored in SDS. They must be registered once before any data can be published to them.

### 2. Message Publishing

**File**: `server/index.ts`, endpoint `POST /api/streams/publish-message`

**Purpose**: Publish a chat message to Somnia Data Streams.

**Process**:
```typescript
// 1. Encode the message according to the schema
const payload = somniaEncoder.encodeData([
  { name: 'timestamp', value: Date.now().toString(), type: 'uint64' },
  { name: 'roomId', value: toHex(roomId, { size: 32 }), type: 'bytes32' },
  { name: 'content', value: text, type: 'string' },
  { name: 'senderName', value: senderName, type: 'string' },
  { name: 'sender', value: senderAddress, type: 'address' },
]);

// 2. Generate unique data ID
const dataId = keccak256(toHex(`${roomId}-${senderName}-${timestamp}`));

// 3. Publish to SDS
const txHash = await somniaSDK.streams.set([{
  id: dataId,
  schemaId: schemaId,
  data: payload
}]);

// 4. Wait for confirmation
await publicClient.waitForTransactionReceipt({ hash: txHash });
```

**Why It Matters**: This is how data gets written to the blockchain. The `SchemaEncoder` ensures type safety, and the transaction confirmation guarantees data persistence.

### 3. Message Retrieval

**File**: `server/index.ts`, endpoint `GET /api/streams/messages/:roomId`

**Purpose**: Query on-chain data and return chat messages for a specific room.

**Process**:
```typescript
// 1. Query all data for the schema published by server wallet
const allData = await somniaSDK.streams.getAllPublisherDataForSchema(
  schemaId,
  serverWalletAddress
);

// 2. Decode each data entry
for (const row of allData) {
  const [timestamp, roomId, content, senderName, sender] = row;
  
  // 3. Filter by room ID
  if (roomId === targetRoomId) {
    messages.push({
      id: dataId,
      text: content,
      senderName: senderName,
      senderAddress: sender,
      timestamp: parseInt(timestamp)
    });
  }
}

// 4. Sort by timestamp and return
return messages.sort((a, b) => a.timestamp - b.timestamp);
```

**Why It Matters**: This demonstrates querying on-chain data. The SDK returns raw data that must be decoded and filtered according to application logic.

### 4. Real-Time Polling

**File**: `services/somniaService.ts`, method `subscribeToMessages()`

**Purpose**: Simulate real-time updates by polling the backend for new messages.

**Process**:
```typescript
// Poll every 5 seconds
setInterval(async () => {
  // 1. Fetch messages from backend
  const response = await fetch(`${baseUrl}/api/streams/messages/${roomId}?schemaId=${schemaId}`);
  const messages = await response.json();
  
  // 2. Filter out messages we've already seen
  const newMessages = messages.filter(msg => !seenMessages.has(msg.id));
  
  // 3. Update seen messages set
  newMessages.forEach(msg => seenMessages.add(msg.id));
  
  // 4. Notify UI of new messages
  if (newMessages.length > 0) {
    callback(newMessages);
  }
}, 5000);
```

**Why It Matters**: This provides a simple real-time experience. Production apps could use WebSockets or Somnia's built-in event streaming for lower latency.

## Data Flow

### Sending a Message

```
User Types Message
       ↓
MessageInput Component
       ↓
Call somniaService.publishMessage()
       ↓
POST /api/streams/publish-message
       ↓
Backend encodes message
       ↓
somniaSDK.streams.set()
       ↓
Transaction signed with server wallet
       ↓
Blockchain confirms transaction
       ↓
Response returned to frontend
       ↓
UI shows success feedback
```

### Receiving Messages

```
Frontend polling timer fires (every 5s)
       ↓
GET /api/streams/messages/:roomId
       ↓
Backend queries SDS
       ↓
somniaSDK.streams.getAllPublisherDataForSchema()
       ↓
Backend decodes and filters data
       ↓
Messages returned as JSON
       ↓
Frontend deduplicates using Set
       ↓
New messages added to UI
       ↓
ChatBubble components render with animations
```

## Schema Design

### Chat Message Schema

```typescript
uint64 timestamp,bytes32 roomId,string content,string senderName,address sender
```

**Field Breakdown**:

- `timestamp` (uint64): Unix timestamp in milliseconds for message ordering
- `roomId` (bytes32): 32-byte identifier for the chat room (allows filtering)
- `content` (string): The actual message text
- `senderName` (string): User's display name (stored in localStorage)
- `sender` (address): Ethereum address of the sender (for verification)

**Design Decisions**:

1. **bytes32 for roomId**: Fixed-size field is more gas-efficient than string
2. **timestamp included**: Ensures chronological ordering without relying on block numbers
3. **separate senderName and sender**: Display name for UI, address for verification
4. **No parent schema**: Root-level schema for simplicity

### Room Registry

Room metadata is stored in a JSON file on the server (`data/chatRooms.json`):

```json
{
  "general": {
    "roomName": "general",
    "schemaId": "0x0000000000000000000000000000000000000000000000000000000000000001",
    "ownerAddress": "0x...",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Why Not On-Chain?**: Room metadata changes frequently and doesn't need blockchain immutability. Storing it server-side reduces gas costs.

## Security Considerations

### Private Key Management

- Server wallet private key stored in `.env` file (never committed)
- Private key never exposed to frontend
- Server signs all transactions on behalf of users
- Uses environment variable validation on startup

### Input Validation

All endpoints validate inputs:

```typescript
// Room name validation
function isValidRoomName(name: string): boolean {
  return name.length > 0 && name.length <= 100;
}

// Schema ID validation (32-byte hex)
function isValidSchemaId(id: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(id);
}

// Sanitization
function sanitizeString(str: string): string {
  return str.trim().slice(0, 1000); // Prevent DoS
}
```

### Rate Limiting

**Not Yet Implemented**: In production, add rate limiting per IP or wallet address to prevent spam.

**Suggested Approach**:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 messages per minute
});

app.post('/api/streams/publish-message', limiter, async (req, res) => {
  // ...
});
```

### CORS Configuration

```typescript
app.use(cors({
  origin: process.env.VITE_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

Restricts API access to the configured frontend origin.

## Performance Optimizations

### Current Optimizations

1. **Schema Registration Check**: Checks if schema exists before attempting registration (saves gas)
2. **Transaction Confirmation**: Waits for confirmation before responding to ensure data persistence
3. **Client-Side Deduplication**: Uses `Set<string>` to track seen messages and avoid re-rendering
4. **Polling Interval**: 5-second polling balances real-time feel with server load

### Potential Improvements

1. **WebSocket Connection**: Replace polling with WebSocket push notifications for true real-time updates
2. **Caching Layer**: Cache messages in Redis to reduce blockchain queries
3. **Batch Publishing**: Allow users to queue messages and publish in batches
4. **Indexed Queries**: Use Somnia's indexing features to filter messages on-chain instead of client-side
5. **Pagination**: Implement cursor-based pagination for rooms with thousands of messages
6. **Message Compression**: Compress message content before encoding to reduce gas costs

## Future Improvements

### Planned Features

1. **Read Receipts**: Track which users have seen each message (additional schema)
2. **Message Editing**: Update existing data entries (SDS supports updates by ID)
3. **Reactions**: Add emoji reactions (separate schema linked by message ID)
4. **File Attachments**: Store IPFS hashes in messages for image/file sharing
5. **End-to-End Encryption**: Encrypt message content before publishing (decrypt client-side)
6. **Moderation**: Admin accounts with ability to delete/hide messages
7. **User Profiles**: On-chain user profiles with avatars and bios

### Scalability Considerations

**Current Limitations**:
- Single server wallet signs all transactions (bottleneck)
- All messages for a schema are fetched then filtered (inefficient at scale)
- No message pagination (could OOM with millions of messages)

**Scalability Solutions**:
- **Multi-Wallet Sharding**: Use multiple server wallets, shard by room ID
- **On-Chain Filtering**: Use SDS advanced queries to filter by roomId on-chain
- **CDN Caching**: Cache recent messages in CDN for faster initial loads
- **Lazy Loading**: Only fetch last N messages, load more on scroll

## Conclusion

This architecture demonstrates a production-ready approach to integrating Somnia Data Streams:

- **Secure**: Private keys isolated server-side
- **Simple**: Frontend is a clean HTTP client
- **Scalable**: Backend can be horizontally scaled
- **Flexible**: Easy to add caching, rate limiting, moderation

The client/server split is a best practice for blockchain applications that require transaction signing. This pattern can be applied to any SDS use case: social media, gaming, IoT data logging, supply chain tracking, and more.

---

**For Questions or Feedback**: [Your Contact Info]

**Related Documentation**:
- [README.md](./README.md) - Getting started guide
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration
- [REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md) - Technical refactoring details
