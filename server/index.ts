import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`CORS enabled for origin: ${viteOrigin}`);
});

export default app;
