import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Address,
  createPublicClient,
  createWalletClient,
  defineChain,
  Hex,
  http,
  isAddress,
  isHex,
  keccak256,
  PublicClient,
  toHex,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SDK, SchemaEncoder, zeroBytes32 } from '@somnia-chain/streams';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.SERVER_PORT || 4000;
const viteOrigin = process.env.VITE_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: viteOrigin,
  credentials: true
}));
app.use(express.json());

// Data persistence helpers
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'chatRooms.json');

interface ChatRoom {
  roomName: string;
  schemaId: string;
  ownerAddress?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface ChatRooms {
  [roomName: string]: ChatRoom;
}

// Ensure data directory and file exist
async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists or error creating
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create it with empty object
    await fs.writeFile(DATA_FILE, JSON.stringify({}, null, 2), 'utf-8');
  }
}

// Read rooms from JSON file
async function readRooms(): Promise<ChatRooms> {
  await ensureDataFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading rooms:', error);
    return {};
  }
}

// Write rooms to JSON file (atomic replace)
async function writeRooms(rooms: ChatRooms): Promise<void> {
  await ensureDataFile();
  const tempFile = `${DATA_FILE}.tmp`;
  try {
    await fs.writeFile(tempFile, JSON.stringify(rooms, null, 2), 'utf-8');
    await fs.rename(tempFile, DATA_FILE);
  } catch (error) {
    console.error('Error writing rooms:', error);
    // Clean up temp file if it exists
    try {
      await fs.unlink(tempFile);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

// Validation helpers
function isValidRoomName(roomName: unknown): roomName is string {
  return typeof roomName === 'string' && roomName.trim().length > 0 && roomName.length <= 100;
}

function isValidSchemaId(schemaId: unknown): schemaId is string {
  return typeof schemaId === 'string' && /^0x[a-fA-F0-9]{64}$/.test(schemaId);
}

function sanitizeRoomName(roomName: string): string {
  return roomName.trim().replace(/[<>]/g, '');
}

function isValidHex(value: unknown): value is Hex {
  return typeof value === 'string' && isHex(value);
}

function isValidAddress(value: unknown): value is Address {
  return typeof value === 'string' && isAddress(value);
}

function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 1000); // Limit length
}

// ============================================================================
// SOMNIA DATA STREAMS (SDS) INITIALIZATION
// ============================================================================
// This section initializes the Somnia Data Streams SDK on the server side.
// The SDK is used to:
// - Register schemas on-chain for structured data storage
// - Publish messages to on-chain data streams
// - Query and retrieve data from the blockchain
//
// IMPORTANT: All SDS operations happen server-side for security.
// The frontend communicates with this backend via REST API.
// ============================================================================

let somniaSDK: SDK | null = null;
let somniaPublicClient: PublicClient | null = null;
let somniaWalletClient: WalletClient | null = null;
let somniaEncoder: SchemaEncoder | null = null;
let serverWalletAddress: Address | null = null;

function initializeSomniaSDK(): void {
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.VITE_SOMNIA_RPC_URL;
  const chainIdStr = process.env.VITE_SOMNIA_CHAIN_ID;
  const chatSchema = process.env.VITE_CHAT_SCHEMA;

  // Validate required environment variables
  if (!privateKey) {
    console.error('ERROR: PRIVATE_KEY environment variable is required for Somnia SDK initialization');
    return;
  }

  if (!rpcUrl) {
    console.error('ERROR: VITE_SOMNIA_RPC_URL environment variable is required');
    return;
  }

  if (!chatSchema) {
    console.error('ERROR: VITE_CHAT_SCHEMA environment variable is required');
    return;
  }

  const chainId = chainIdStr ? parseInt(chainIdStr, 10) : 50312;

  try {
    // Define Somnia chain
    const somniaChain = defineChain({
      id: chainId,
      name: chainId === 50312 ? 'Somnia Testnet' : 'Somnia Network',
      nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
      rpcUrls: {
        default: { http: [rpcUrl] },
        public: { http: [rpcUrl] },
      },
    });

    // Create account from private key
    const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey as Hex : `0x${privateKey}` as Hex;
    const account = privateKeyToAccount(formattedPrivateKey);
    serverWalletAddress = account.address;

    // Create clients
    const publicClient = createPublicClient({
      chain: somniaChain,
      transport: http(rpcUrl),
    });

    const walletClient = createWalletClient({
      account,
      chain: somniaChain,
      transport: http(rpcUrl),
    });

    somniaPublicClient = publicClient as any as PublicClient;
    somniaWalletClient = walletClient as any as WalletClient;

    // Initialize SDK
    somniaSDK = new SDK({
      public: publicClient as any,
      wallet: walletClient as any,
    });

    // Initialize encoder
    somniaEncoder = new SchemaEncoder(chatSchema);

    console.log('✓ Somnia SDK initialized successfully');
    console.log(`✓ Server wallet address: ${serverWalletAddress}`);
  } catch (error) {
    console.error('ERROR: Failed to initialize Somnia SDK:', error);
    somniaSDK = null;
    somniaPublicClient = null;
    somniaWalletClient = null;
    somniaEncoder = null;
    serverWalletAddress = null;
  }
}

// Initialize Somnia SDK on startup
initializeSomniaSDK();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    somniaInitialized: somniaSDK !== null
  });
});

// POST /api/create-room - Create or update a room
app.post('/api/create-room', async (req, res) => {
  try {
    const { roomName, schemaId, ownerAddress, metadata } = req.body;

    // Validate required fields
    if (!isValidRoomName(roomName)) {
      return res.status(400).json({ 
        error: 'Invalid roomName. Must be a non-empty string (max 100 chars).' 
      });
    }

    if (!isValidSchemaId(schemaId)) {
      return res.status(400).json({ 
        error: 'Invalid schemaId. Must be a 32-byte hex string (0x followed by 64 hex chars).' 
      });
    }

    // Sanitize inputs
    const sanitizedRoomName = sanitizeRoomName(roomName);
    
    // Validate ownerAddress if provided
    if (ownerAddress && typeof ownerAddress !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid ownerAddress. Must be a string.' 
      });
    }

    // Read existing rooms
    const rooms = await readRooms();
    
    // Check if room exists
    const existingRoom = rooms[sanitizedRoomName];
    const now = new Date().toISOString();
    
    // Create or update room
    const room: ChatRoom = {
      roomName: sanitizedRoomName,
      schemaId,
      ownerAddress: ownerAddress || existingRoom?.ownerAddress,
      metadata: metadata || existingRoom?.metadata,
      createdAt: existingRoom?.createdAt || now,
      updatedAt: now
    };

    // Save to storage
    rooms[sanitizedRoomName] = room;
    await writeRooms(rooms);

    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// GET /api/rooms/:roomName - Get a specific room
app.get('/api/rooms/:roomName', async (req, res) => {
  try {
    const { roomName } = req.params;

    if (!roomName || !isValidRoomName(roomName)) {
      return res.status(400).json({ 
        error: 'Invalid roomName parameter.' 
      });
    }

    const sanitizedRoomName = sanitizeRoomName(roomName);
    const rooms = await readRooms();
    const room = rooms[sanitizedRoomName];

    if (!room) {
      return res.status(404).json({ 
        error: `Room '${sanitizedRoomName}' not found.` 
      });
    }

    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// GET /api/rooms - List all rooms sorted by updated time
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await readRooms();
    const roomList = Object.values(rooms).sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    res.json(roomList);
  } catch (error) {
    console.error('Error listing rooms:', error);
    res.status(500).json({ error: 'Failed to list rooms' });
  }
});

// ============================================================================
// SDS ENDPOINT: SCHEMA REGISTRATION
// ============================================================================
// This endpoint registers a data schema on the Somnia blockchain.
// Schemas define the structure of data that will be stored in SDS.
//
// Process:
// 1. Check if schema is already registered (saves gas)
// 2. If not, call sdk.streams.registerDataSchemas() with schema definition
// 3. Wait for transaction confirmation
// 4. Return transaction hash to client
//
// Schema format: "uint64 timestamp,bytes32 roomId,string content,string senderName,address sender"
// ============================================================================
app.post('/api/streams/register-schema', async (req, res) => {
  try {
    // Check if Somnia SDK is initialized
    if (!somniaSDK || !somniaPublicClient) {
      return res.status(503).json({ 
        error: 'Somnia SDK not initialized. Check server configuration and environment variables.' 
      });
    }

    const { roomName, roomId, schemaId } = req.body;

    // Validate inputs
    if (!isValidRoomName(roomName)) {
      return res.status(400).json({ 
        error: 'Invalid roomName. Must be a non-empty string (max 100 chars).' 
      });
    }

    if (!sanitizeString(roomId)) {
      return res.status(400).json({ 
        error: 'Invalid roomId. Must be a non-empty string.' 
      });
    }

    if (!isValidSchemaId(schemaId)) {
      return res.status(400).json({ 
        error: 'Invalid schemaId. Must be a 32-byte hex string (0x followed by 64 hex chars).' 
      });
    }

    const schemaIdHex = schemaId as Hex;

    // SDS OPERATION: Check if schema is already registered
    // This avoids unnecessary gas costs by not re-registering schemas
    const isRegistered = await somniaSDK.streams.isDataSchemaRegistered(schemaIdHex);
    
    if (isRegistered) {
      console.log(`Schema ${schemaId} is already registered`);
      return res.status(200).json({ txHash: null, alreadyRegistered: true });
    }

    // Get schema definition from environment
    const chatSchema = process.env.VITE_CHAT_SCHEMA;
    if (!chatSchema) {
      return res.status(500).json({ 
        error: 'Chat schema not configured on server' 
      });
    }

    console.log(`Registering schema ${schemaId}...`);
    
    // SDS OPERATION: Register the schema on-chain
    // This creates a reusable schema that defines the structure of chat messages
    // Parameters:
    // - id: Unique identifier for this schema (32-byte hex)
    // - schema: The schema definition string (e.g., "uint64 timestamp,string content,...")
    // - parentSchemaId: Parent schema if inheriting (zeroBytes32 for root schemas)
    // - waitForReceipt: true to wait for transaction confirmation
    const txHash = await somniaSDK.streams.registerDataSchemas(
      [{ id: schemaIdHex, schema: chatSchema, parentSchemaId: zeroBytes32 as Hex }],
      true
    );

    if (!txHash) {
      return res.status(500).json({ 
        error: 'Failed to register schema. No transaction hash returned.' 
      });
    }

    // Wait for transaction confirmation before notifying client
    await somniaPublicClient.waitForTransactionReceipt({ hash: txHash as Hex });
    
    console.log(`Schema registered successfully. Transaction: ${txHash}`);
    
    res.status(200).json({ txHash: txHash as string, alreadyRegistered: false });
  } catch (error) {
    console.error('Error registering schema:', error);
    res.status(500).json({ 
      error: 'Failed to register schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// SDS ENDPOINT: MESSAGE PUBLISHING
// ============================================================================
// This endpoint publishes a chat message to Somnia Data Streams.
//
// Process:
// 1. Validate message data (text, sender info, room ID, schema ID)
// 2. Encode message data according to the registered schema using SchemaEncoder
// 3. Generate unique data ID using keccak256 hash
// 4. Publish to SDS using sdk.streams.set()
// 5. Wait for transaction confirmation
// 6. Return transaction hash to client
//
// The encoded data is stored immutably on-chain and can be queried later.
// ============================================================================
app.post('/api/streams/publish-message', async (req, res) => {
  try {
    // Check if Somnia SDK is initialized
    if (!somniaSDK || !somniaPublicClient || !somniaEncoder || !serverWalletAddress) {
      return res.status(503).json({ 
        error: 'Somnia SDK not initialized. Check server configuration and environment variables.' 
      });
    }

    const { text, senderName, senderAddress, roomId, schemaId } = req.body;

    // Validate inputs
    if (!sanitizeString(text)) {
      return res.status(400).json({ 
        error: 'Invalid text. Must be a non-empty string.' 
      });
    }

    if (!sanitizeString(senderName)) {
      return res.status(400).json({ 
        error: 'Invalid senderName. Must be a non-empty string.' 
      });
    }

    if (!isValidAddress(senderAddress)) {
      return res.status(400).json({ 
        error: 'Invalid senderAddress. Must be a valid Ethereum address.' 
      });
    }

    if (!sanitizeString(roomId)) {
      return res.status(400).json({ 
        error: 'Invalid roomId. Must be a non-empty string.' 
      });
    }

    if (!isValidSchemaId(schemaId)) {
      return res.status(400).json({ 
        error: 'Invalid schemaId. Must be a 32-byte hex string (0x followed by 64 hex chars).' 
      });
    }

    const timestamp = Date.now();
    const schemaIdHex = schemaId as Hex;
    const senderAddressHex = senderAddress as Address;

    // SDS OPERATION: Encode message data according to schema
    // SchemaEncoder ensures data matches the registered schema format
    // Each field must match the type and order defined in the schema
    const payload: Hex = somniaEncoder.encodeData([
      { name: 'timestamp', value: timestamp.toString(), type: 'uint64' },
      { name: 'roomId', value: toHex(roomId, { size: 32 }), type: 'bytes32' },
      { name: 'content', value: text, type: 'string' },
      { name: 'senderName', value: senderName, type: 'string' },
      { name: 'sender', value: senderAddressHex, type: 'address' },
    ]);

    // Generate a unique identifier for this data entry
    // This prevents duplicate messages and allows for future updates
    const uniqueString = `${roomId}-${senderName}-${timestamp}`;
    const dataId = keccak256(toHex(uniqueString));

    console.log(`Publishing message to room ${roomId} from ${senderName}...`);

    // SDS OPERATION: Publish encoded data to the blockchain
    // sdk.streams.set() writes data to Somnia Data Streams
    // Parameters:
    // - id: Unique identifier for this data entry
    // - schemaId: The schema this data conforms to
    // - data: The encoded payload (Hex string)
    const txHash = await somniaSDK.streams.set([{ id: dataId, schemaId: schemaIdHex, data: payload }]);

    if (!txHash) {
      return res.status(500).json({ 
        error: 'Failed to publish message. No transaction hash returned.' 
      });
    }

    // Wait for blockchain confirmation before responding to client
    await somniaPublicClient.waitForTransactionReceipt({ hash: txHash as Hex });
    
    console.log(`Message published successfully. Transaction: ${txHash}`);
    
    res.status(200).json({ 
      txHash: txHash as string, 
      timestamp 
    });
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).json({ 
      error: 'Failed to publish message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// SDS ENDPOINT: MESSAGE RETRIEVAL
// ============================================================================
// This endpoint queries Somnia Data Streams to retrieve chat messages.
//
// Process:
// 1. Validate room ID and schema ID
// 2. Query all data published by the server wallet for the given schema
// 3. Decode the data using SchemaEncoder
// 4. Filter messages by room ID (extracted from decoded data)
// 5. Sort by timestamp and return to client
//
// Note: This queries ALL data for the schema, then filters client-side.
// In production, you might want to implement more efficient filtering.
// ============================================================================
app.get('/api/streams/messages/:roomId', async (req, res) => {
  try {
    // Check if Somnia SDK is initialized
    if (!somniaSDK || !serverWalletAddress) {
      return res.status(503).json({ 
        error: 'Somnia SDK not initialized. Check server configuration and environment variables.' 
      });
    }

    const { roomId } = req.params;
    const { schemaId } = req.query;

    // Validate inputs
    if (!sanitizeString(roomId)) {
      return res.status(400).json({ 
        error: 'Invalid roomId. Must be a non-empty string.' 
      });
    }

    if (!schemaId || !isValidSchemaId(schemaId)) {
      return res.status(400).json({ 
        error: 'Invalid or missing schemaId query parameter. Must be a 32-byte hex string.' 
      });
    }

    const schemaIdHex = schemaId as Hex;

    console.log(`Fetching messages for room ${roomId} with schema ${schemaId}...`);

    // Encode roomId the same way it was encoded when publishing
    // This is crucial for matching - encoding must be consistent
    const roomIdHex = toHex(roomId, { size: 32 });

    // SDS OPERATION: Retrieve all data published by this server for the given schema
    // sdk.streams.getAllPublisherDataForSchema() returns all data entries
    // that match the schema ID and were published by the server wallet
    const allData = await somniaSDK.streams.getAllPublisherDataForSchema(
      schemaIdHex, 
      serverWalletAddress
    );

    if (!Array.isArray(allData)) {
      return res.json([]);
    }

    // Parse and filter messages by room ID
    // Since all rooms use the same schema, we need to filter by the roomId field
    const messages: any[] = [];
    const val = (field: any) => field?.value?.value ?? field?.value ?? '';

    for (const row of (allData as any[][])) {
      if (!Array.isArray(row) || row.length < 5) continue;
      
      const timestamp = Number(val(row[0]));
      const messageRoomId = String(val(row[1]));
      const content = String(val(row[2]));
      const senderName = String(val(row[3]));
      const senderAddress = String(val(row[4]));

      // Filter by room ID (compare hex-encoded values)
      if (messageRoomId !== roomIdHex) continue;

      const messageId = `${timestamp}-${senderName}-${content}`;

      messages.push({
        id: messageId,
        timestamp,
        roomId: messageRoomId,
        text: content,
        senderName,
        senderAddress,
        sender: 'other', // Server doesn't determine sender type, client will handle this
      });
    }
    
    // Sort by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp);

    console.log(`Found ${messages.length} messages for room ${roomId}`);
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`CORS enabled for origin: ${viteOrigin}`);
});

export default app;
