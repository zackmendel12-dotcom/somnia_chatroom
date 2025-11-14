# Somnia Streams Server Endpoints

This document describes the Somnia Streams endpoints that have been added to the Express server.

## Overview

All Somnia Streams SDK operations (schema registration, message publishing, and message retrieval) have been moved to the server. The server uses its own wallet (configured via the `PRIVATE_KEY` environment variable) to interact with the Somnia blockchain.

## Environment Variables

The following environment variables are required for Somnia Streams functionality:

- `PRIVATE_KEY` - Server's private key for signing transactions (without 0x prefix)
- `VITE_SOMNIA_RPC_URL` - RPC endpoint for Somnia network
- `VITE_SOMNIA_CHAIN_ID` - Chain ID (e.g., 50312 for testnet)
- `VITE_CHAT_SCHEMA` - Chat schema definition

## Endpoints

### POST /api/streams/register-schema

Register a data schema on-chain if it's not already registered.

**Request Body:**
```json
{
  "roomName": "string",
  "roomId": "string",
  "schemaId": "0x..." // 32-byte hex string
}
```

**Response (200 OK - New Registration):**
```json
{
  "txHash": "0x...",
  "alreadyRegistered": false
}
```

**Response (200 OK - Already Registered):**
```json
{
  "txHash": null,
  "alreadyRegistered": true
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input parameters
- `503 Service Unavailable` - Somnia SDK not initialized
- `500 Internal Server Error` - Registration failed

---

### POST /api/streams/publish-message

Publish a message to a room using the server's wallet.

**Request Body:**
```json
{
  "text": "string",
  "senderName": "string",
  "senderAddress": "0x...", // Ethereum address
  "roomId": "string",
  "schemaId": "0x..." // 32-byte hex string
}
```

**Response (200 OK):**
```json
{
  "txHash": "0x...",
  "timestamp": 1234567890123
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input parameters
- `503 Service Unavailable` - Somnia SDK not initialized
- `500 Internal Server Error` - Publishing failed

---

### GET /api/streams/messages/:roomId

Retrieve all messages for a specific room.

**URL Parameters:**
- `roomId` - The room identifier

**Query Parameters:**
- `schemaId` - The schema ID (required, 32-byte hex string)

**Example:**
```
GET /api/streams/messages/my-room?schemaId=0x0000000000000000000000000000000000000000000000000000000000000001
```

**Response (200 OK):**
```json
[
  {
    "id": "1234567890-alice-hello",
    "timestamp": 1234567890,
    "roomId": "my-room",
    "text": "hello",
    "senderName": "alice",
    "senderAddress": "0x...",
    "sender": "other"
  }
]
```

**Error Responses:**
- `400 Bad Request` - Invalid input parameters
- `503 Service Unavailable` - Somnia SDK not initialized
- `500 Internal Server Error` - Retrieval failed

---

## Health Check

The `/health` endpoint includes a `somniaInitialized` field to indicate whether the Somnia SDK is properly initialized:

```json
{
  "status": "ok",
  "timestamp": "2025-11-14T19:00:00.000Z",
  "somniaInitialized": true
}
```

## Server Initialization

The server initializes the Somnia SDK on startup. If required environment variables are missing, the server will:
1. Log clear error messages to console
2. Continue running but with `somniaInitialized: false`
3. Return 503 errors for all Somnia Streams endpoints

**Successful initialization logs:**
```
✓ Somnia SDK initialized successfully
✓ Server wallet address: 0x...
```

**Missing environment variable errors:**
```
ERROR: PRIVATE_KEY environment variable is required for Somnia SDK initialization
ERROR: VITE_SOMNIA_RPC_URL environment variable is required
ERROR: VITE_CHAT_SCHEMA environment variable is required
```

## Message Format

All messages returned from `/api/streams/messages/:roomId` conform to the frontend `Message` interface:

```typescript
interface Message {
  id: string;
  text: string;
  sender: 'self' | 'other';
  timestamp: number;
  senderName: string;
  senderAddress: string;
  roomId: string;
}
```

Note: The server always sets `sender: 'other'`. The client should update this field based on the current user's identity.

## Validation

All endpoints perform strict validation:

- **Room names**: Non-empty strings, max 100 characters
- **Schema IDs**: 32-byte hex strings (0x followed by 64 hex characters)
- **Addresses**: Valid Ethereum addresses
- **Strings**: Trimmed and limited to 1000 characters

Invalid inputs return 400 Bad Request with descriptive error messages.

## Existing Endpoints

The following room persistence endpoints remain unchanged:

- `POST /api/create-room` - Create or update a room
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:roomName` - Get a specific room
