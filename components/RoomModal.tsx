import React, { useState, useEffect } from 'react';
import { Hex } from 'viem';
import { API_BASE_URL } from '../constants';

interface Room {
  roomName: string;
  schemaId: string;
  ownerAddress?: string;
  createdAt: string;
  updatedAt: string;
}

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomSelect: (roomName: string, schemaId: Hex) => void;
  defaultSchemaId: string;
}

function RoomModal({ isOpen, onClose, onRoomSelect, defaultSchemaId }: RoomModalProps) {
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create room form state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSchemaId, setNewRoomSchemaId] = useState(defaultSchemaId);

  useEffect(() => {
    if (isOpen && activeTab === 'join') {
      fetchRooms();
    }
  }, [isOpen, activeTab]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms`);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate inputs
    if (!newRoomName.trim()) {
      setError('Room name is required');
      setLoading(false);
      return;
    }

    if (!/^0x[a-fA-F0-9]{64}$/.test(newRoomSchemaId)) {
      setError('Invalid schema ID format. Must be 0x followed by 64 hex characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/create-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: newRoomName.trim(),
          schemaId: newRoomSchemaId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create room');
      }

      const room = await response.json();
      
      // Store last room in localStorage
      localStorage.setItem('lastRoom', JSON.stringify({
        roomName: room.roomName,
        schemaId: room.schemaId,
      }));

      onRoomSelect(room.roomName, room.schemaId as Hex);
      onClose();
      
      // Reset form
      setNewRoomName('');
      setNewRoomSchemaId(defaultSchemaId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (room: Room) => {
    // Store last room in localStorage
    localStorage.setItem('lastRoom', JSON.stringify({
      roomName: room.roomName,
      schemaId: room.schemaId,
    }));

    onRoomSelect(room.roomName, room.schemaId as Hex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-somnia-medium rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-somnia-light">
          <h2 className="text-2xl font-bold text-somnia-text">Chat Rooms</h2>
          <button
            onClick={onClose}
            className="text-somnia-text-secondary hover:text-somnia-text transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-somnia-light">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'join'
                ? 'text-somnia-accent border-b-2 border-somnia-accent'
                : 'text-somnia-text-secondary hover:text-somnia-text'
            }`}
          >
            Join Room
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'create'
                ? 'text-somnia-accent border-b-2 border-somnia-accent'
                : 'text-somnia-text-secondary hover:text-somnia-text'
            }`}
          >
            Create Room
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          {activeTab === 'join' && (
            <div>
              {loading ? (
                <div className="text-center py-8 text-somnia-text-secondary">Loading rooms...</div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-8 text-somnia-text-secondary">
                  <p>No rooms available yet.</p>
                  <p className="mt-2">Create the first room to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <button
                      key={room.roomName}
                      onClick={() => handleJoinRoom(room)}
                      className="w-full text-left p-4 bg-somnia-light hover:bg-somnia-dark border border-somnia-light rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-somnia-text">{room.roomName}</h3>
                          <p className="text-xs text-somnia-text-secondary mt-1">
                            Schema: {room.schemaId.slice(0, 10)}...{room.schemaId.slice(-8)}
                          </p>
                          <p className="text-xs text-somnia-text-secondary mt-1">
                            Updated: {new Date(room.updatedAt).toLocaleString()}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-somnia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-somnia-text mb-2">
                  Room Name
                </label>
                <input
                  id="roomName"
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name..."
                  maxLength={100}
                  className="w-full bg-somnia-light border border-somnia-light text-somnia-text rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-somnia-accent"
                  required
                />
              </div>

              <div>
                <label htmlFor="schemaId" className="block text-sm font-medium text-somnia-text mb-2">
                  Schema ID
                </label>
                <input
                  id="schemaId"
                  type="text"
                  value={newRoomSchemaId}
                  onChange={(e) => setNewRoomSchemaId(e.target.value)}
                  placeholder="0x..."
                  pattern="^0x[a-fA-F0-9]{64}$"
                  className="w-full bg-somnia-light border border-somnia-light text-somnia-text rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-somnia-accent font-mono text-sm"
                  required
                />
                <p className="mt-1 text-xs text-somnia-text-secondary">
                  32-byte hex string (0x followed by 64 hex characters)
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-somnia-accent hover:bg-somnia-accent-dark text-white font-bold py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-somnia-medium focus:ring-somnia-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Room...' : 'Create Room'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomModal;
