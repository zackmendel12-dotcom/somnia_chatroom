# Somnia Service Refactor Summary

This document summarizes the refactoring work completed on the Somnia service to remove hardcoded private keys and make it modular.

## Changes Made

### 1. Service Architecture (`services/somniaService.ts`)

**Before:**
- Singleton service with hardcoded private key from environment
- Fixed schemaId and roomId values
- Methods didn't accept external dependencies

**After:**
- Class-based service accepting wallet client as dependency
- All methods accept schemaId and roomId as parameters
- Support for both client-side (wagmi) and server-side (private key) wallet clients
- Factory functions for easy instantiation:
  - `createServiceWithWalletClient()` - for client-side use with wagmi
  - `createServiceWithPrivateKey()` - for server-side use

### 2. New Service Methods

#### `registerChatSchema(schemaId: Hex, schema?: string): Promise<Hex | null>`
- Register a chat schema on-chain
- Returns transaction hash if successful, null if already registered
- Handles `SchemaAlreadyRegistered` errors gracefully
- Waits for transaction receipt confirmation

#### `getRoomMessages(schemaId: Hex, roomId: string, publisherAddress: Address, currentUser?: string): Promise<Message[]>`
- Fetch all messages for a specific room
- Filters messages by roomId
- Returns sorted messages by timestamp
- Properly decodes sender information

#### `publishMessage(text: string, senderName: string, roomId: string, schemaId: Hex): Promise<Hex>`
- Publish a message to a specified room with a specific schema
- Requires wallet client with account
- Returns transaction hash after confirmation

#### `subscribeToMessages(callback, schemaId, roomId, publisherAddress, currentUser, pollIntervalMs?): void`
- Subscribe to new messages via polling (default 5000ms)
- Automatic message deduplication using message IDs
- Filters by roomId
- Properly cleans up on unsubscribe

#### `unsubscribe(): void`
- Stop polling for new messages
- Cleans up timers and resources

### 3. React Hook (`src/hooks/useSomniaService.ts`)

New hook for easy integration with React and wagmi:
```typescript
const somniaService = useSomniaService();
```

- Automatically creates service when wallet is connected
- Returns null when no wallet is connected
- Uses wagmi's wallet and public clients

### 4. App Integration (`App.tsx`)

Updated to use the new service architecture:
- Uses `useSomniaService()` hook instead of singleton
- Automatically registers schema on wallet connection
- Passes schemaId and roomId to all service methods
- Shows schema registration status in UI
- Properly handles service lifecycle

### 5. Tests (`services/somniaService.test.ts`)

Comprehensive test coverage for:
- **Schema Registration:**
  - New schema registration success
  - Already-registered schema handling (returns null)
  - SchemaAlreadyRegistered error propagation
  - Other error propagation
  - Null/falsy registration response handling
  - Signer requirements
- **Message Publishing:**
  - Account requirement validation
- **Message Retrieval:**
  - Room filtering
  - Timestamp sorting
  - Empty data handling
- **Subscriptions:**
  - Polling interval management
  - Cleanup on unsubscribe

All 11 tests passing ✓

### 6. Environment & Configuration

- Removed `PRIVATE_KEY` from `constants.ts` (no longer imported in client code)
- Private key now only used server-side via `PRIVATE_KEY` environment variable
- All blockchain signing operations are handled by the backend server

### 7. Documentation

Added comprehensive documentation:
- `services/README.md` - API documentation with examples
- JSDoc comments on all public methods
- TypeScript types for all parameters

## Key Benefits

1. **Security**: No hardcoded private keys in service singleton
2. **Flexibility**: Service works with any wallet client (wagmi, server-side, etc.)
3. **Modularity**: All methods accept dependencies as parameters
4. **Testability**: Fully mockable with comprehensive test coverage
5. **Type Safety**: Strong TypeScript typing throughout
6. **Documentation**: Clear API documentation and examples
7. **React Integration**: Easy-to-use hook for React components

## Migration Guide

### Before (Old API)
```typescript
import somniaService from './services/somniaService';

// Service was a singleton with hardcoded configuration
await somniaService.publishMessage('Hello', 'Alice');
somniaService.subscribeToMessages(callback, 'Alice');
```

### After (New API)

#### Client-Side with React/wagmi
```typescript
import { useSomniaService } from './src/hooks/useSomniaService';

const somniaService = useSomniaService();
const { address } = useAccount();

// All methods now require explicit parameters
await somniaService?.publishMessage('Hello', 'Alice', 'general', SCHEMA_ID);
somniaService?.subscribeToMessages(callback, SCHEMA_ID, 'general', address, 'Alice');
```

#### Server-Side
```typescript
import { createServiceWithPrivateKey } from './services/somniaService';

const service = createServiceWithPrivateKey(process.env.PRIVATE_KEY);
await service.publishMessage('Hello', 'Bot', 'general', SCHEMA_ID);
```

## Testing & Validation

✅ All tests pass (11/11)
✅ TypeScript compilation successful
✅ No hardcoded private keys in service
✅ Schema registration works from connected wallet
✅ Pub/sub mechanism respects unique message IDs
✅ Clean timer cleanup on unsubscribe

## Acceptance Criteria Met

- [x] Service no longer references private keys
- [x] Passes lint/type-check
- [x] Tests run with `npm test` and succeed (11/11 passing)
- [x] Schema registration can be triggered from connected wallet
- [x] Methods accept dependencies (wallet client, schemaId, roomId)
- [x] Supports both client-side and server-side signing
- [x] Pub/sub mechanism with unique message IDs and cleanup
- [x] Comprehensive test coverage including mocked SDK
