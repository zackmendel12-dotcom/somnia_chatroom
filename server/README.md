# Room API Server

Express server providing REST API endpoints for managing chat rooms with persistent storage.

## Getting Started

### Environment Variables

Configure the following environment variables (see `.env.example`):

- `SERVER_PORT` - Port for the server (default: 4001)
- `VITE_ORIGIN` - CORS origin for Vite dev server (default: http://localhost:3000)

### Running the Server

```bash
# Development mode (with hot reload via tsx)
npm run dev:server

# Both client and server
npm run dev
```

### Building the Server

```bash
npm run build:server
```

## API Endpoints

### Health Check

**GET** `/health`

Returns server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T08:13:52.961Z"
}
```

### Create/Update Room

**POST** `/api/create-room`

Creates a new room or updates an existing one (upsert). If a room with the same `roomName` exists, it will be updated with the new `schemaId` and `metadata`.

**Request Body:**
```json
{
  "roomName": "my-room",
  "schemaId": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "ownerAddress": "0xOwnerAddress",
  "metadata": {
    "description": "Room description",
    "custom": "fields"
  }
}
```

**Required Fields:**
- `roomName` - Non-empty string (max 100 chars), will be trimmed and sanitized
- `schemaId` - 32-byte hex string (0x followed by 64 hex characters)

**Optional Fields:**
- `ownerAddress` - String representing the owner's address
- `metadata` - Object with custom metadata

**Response (201):**
```json
{
  "roomName": "my-room",
  "schemaId": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "ownerAddress": "0xOwnerAddress",
  "metadata": {
    "description": "Room description",
    "custom": "fields"
  },
  "createdAt": "2025-11-14T08:13:59.442Z",
  "updatedAt": "2025-11-14T08:13:59.442Z"
}
```

**Error Responses:**
- `400` - Invalid roomName or schemaId
- `500` - Server error

### Get Room by Name

**GET** `/api/rooms/:roomName`

Retrieves a specific room by its name.

**Response (200):**
```json
{
  "roomName": "my-room",
  "schemaId": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "ownerAddress": "0xOwnerAddress",
  "metadata": {
    "description": "Room description"
  },
  "createdAt": "2025-11-14T08:13:59.442Z",
  "updatedAt": "2025-11-14T08:13:59.442Z"
}
```

**Error Responses:**
- `404` - Room not found
- `400` - Invalid room name parameter
- `500` - Server error

### List All Rooms

**GET** `/api/rooms`

Returns all rooms sorted by `updatedAt` (most recent first).

**Response (200):**
```json
[
  {
    "roomName": "room-2",
    "schemaId": "0xabcdef...",
    "createdAt": "2025-11-14T08:14:28.797Z",
    "updatedAt": "2025-11-14T08:14:28.797Z"
  },
  {
    "roomName": "room-1",
    "schemaId": "0x123456...",
    "ownerAddress": "0xOwner",
    "metadata": {},
    "createdAt": "2025-11-14T08:13:59.442Z",
    "updatedAt": "2025-11-14T08:13:59.442Z"
  }
]
```

**Error Responses:**
- `500` - Server error

## Data Persistence

Room data is persisted to `data/chatRooms.json` in the project root. The file is:

- Created automatically if it doesn't exist
- Written atomically (via temporary file and rename) to prevent corruption
- Formatted with pretty JSON (2-space indentation)
- Ignored by git (via `.gitignore`)

## Validation & Sanitization

### Room Name
- Must be non-empty after trimming
- Maximum 100 characters
- `<` and `>` characters are removed
- Leading/trailing whitespace is trimmed

### Schema ID
- Must be a valid 32-byte hex string
- Format: `0x` followed by exactly 64 hexadecimal characters
- Regex: `/^0x[a-fA-F0-9]{64}$/`

## Example Usage

```bash
# Create a room
curl -X POST http://localhost:4001/api/create-room \
  -H "Content-Type: application/json" \
  -d '{
    "roomName": "general",
    "schemaId": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "ownerAddress": "0xOwner",
    "metadata": {"description": "General chat room"}
  }'

# Get a specific room
curl http://localhost:4001/api/rooms/general

# List all rooms
curl http://localhost:4001/api/rooms

# Update an existing room
curl -X POST http://localhost:4001/api/create-room \
  -H "Content-Type: application/json" \
  -d '{
    "roomName": "general",
    "schemaId": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "metadata": {"description": "Updated description"}
  }'
```
