import React, { useState, useEffect } from 'react';
import { Hex } from 'viem';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import AccessibleModal from './ui/AccessibleModal';
import CharacterCounter from './ui/CharacterCounter';
import ValidationFeedback from './ui/ValidationFeedback';
import SkeletonLoader from './ui/SkeletonLoader';
import Badge from './ui/Badge';
import { API_BASE_URL } from '../constants';
import useReducedMotion from '../src/hooks/useReducedMotion';
import { motionTheme } from '../src/config/motionTheme';

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

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => `-${theme.spacing.lg} -${theme.spacing.lg} ${theme.spacing.lg}`};
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, $active }) => $active ? theme.colors.accent : theme.colors.textSecondary};
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.colors.accent : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 150ms ease-in-out;

  &:hover {
    color: ${({ theme, $active }) => $active ? theme.colors.accent : theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

const ErrorAlert = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error}15;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RoomCard = styled.button`
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  cursor: pointer;
  transition: all 150ms ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;

const RoomCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RoomCardTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.typography.lineHeight.lg};
`;

const RoomCardIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.accent};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const RoomCardMetadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const RoomCardDetail = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm};
  font-family: 'Courier New', monospace;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing['3xl']} ${theme.spacing.md}`};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.5;
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm};
`;

const Input = styled.input<{ $hasError: boolean; $mono?: boolean }>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.base};
  transition: border-color 150ms ease-in-out, box-shadow 150ms ease-in-out;
  font-family: ${({ $mono }) => $mono ? '"Courier New", monospace' : 'inherit'};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.error : theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
      $hasError ? `${theme.colors.error}20` : `${theme.colors.accent}20`
    };
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InputMetadata = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 20px;
`;

const HelperText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.xs};
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.base};
  cursor: pointer;
  transition: all 150ms ease-in-out;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.accentDark};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabContent = styled(motion.div)`
  width: 100%;
`;

const ROOM_NAME_MAX = 100;
const ROOM_NAME_MIN = 3;

function RoomModal({ isOpen, onClose, onRoomSelect, defaultSchemaId }: RoomModalProps) {
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Create room form state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomSchemaId, setNewRoomSchemaId] = useState(defaultSchemaId);
  const [roomNameTouched, setRoomNameTouched] = useState(false);
  const [schemaIdTouched, setSchemaIdTouched] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'join') {
      fetchRooms();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (isOpen) {
      setNewRoomSchemaId(defaultSchemaId);
    }
  }, [isOpen, defaultSchemaId]);

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

  // Validation
  const trimmedRoomName = newRoomName.trim();
  const isRoomNameValid = trimmedRoomName.length >= ROOM_NAME_MIN && trimmedRoomName.length <= ROOM_NAME_MAX;
  const isSchemaIdValid = /^0x[a-fA-F0-9]{64}$/.test(newRoomSchemaId);

  const getRoomNameValidationMessage = () => {
    if (trimmedRoomName.length < ROOM_NAME_MIN) {
      return `Room name must be at least ${ROOM_NAME_MIN} characters`;
    }
    if (trimmedRoomName.length > ROOM_NAME_MAX) {
      return `Room name cannot exceed ${ROOM_NAME_MAX} characters`;
    }
    return 'Room name looks good!';
  };

  const getSchemaIdValidationMessage = () => {
    if (!newRoomSchemaId.startsWith('0x')) {
      return 'Schema ID must start with 0x';
    }
    if (newRoomSchemaId.length !== 66) {
      return 'Schema ID must be exactly 66 characters (0x + 64 hex chars)';
    }
    if (!/^0x[a-fA-F0-9]{64}$/.test(newRoomSchemaId)) {
      return 'Schema ID must contain only hexadecimal characters';
    }
    return 'Schema ID is valid!';
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoomNameTouched(true);
    setSchemaIdTouched(true);
    setLoading(true);
    setError(null);

    if (!isRoomNameValid || !isSchemaIdValid) {
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
          roomName: trimmedRoomName,
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
      setRoomNameTouched(false);
      setSchemaIdTouched(false);
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

  const formatAddress = (address?: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleModalClose = () => {
    setError(null);
    setNewRoomName('');
    setNewRoomSchemaId(defaultSchemaId);
    setRoomNameTouched(false);
    setSchemaIdTouched(false);
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Chat Rooms"
      size="xl"
      closeOnOverlayClick={false}
    >
      <TabContainer>
        <Tab 
          type="button"
          $active={activeTab === 'join'} 
          onClick={() => setActiveTab('join')}
        >
          Join Room
        </Tab>
        <Tab 
          type="button"
          $active={activeTab === 'create'} 
          onClick={() => setActiveTab('create')}
        >
          Create Room
        </Tab>
      </TabContainer>

      {error && (
        <ErrorAlert role="alert">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </ErrorAlert>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'join' && (
          <TabContent
            key="join-tab"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
            transition={{
              duration: prefersReducedMotion ? 0 : motionTheme.duration.fast,
              ease: motionTheme.ease.out,
            }}
          >
            {loading ? (
              <SkeletonLoader count={3} height="100px" />
            ) : rooms.length === 0 ? (
              <EmptyState>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3>No rooms available</h3>
                <p>Be the first to create a chat room!</p>
              </EmptyState>
            ) : (
              <RoomList>
                {rooms.map((room) => (
                  <RoomCard
                    key={room.roomName}
                    type="button"
                    onClick={() => handleJoinRoom(room)}
                  >
                    <RoomCardHeader>
                      <RoomCardTitle>{room.roomName}</RoomCardTitle>
                      <RoomCardIcon>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </RoomCardIcon>
                    </RoomCardHeader>
                    <RoomCardDetail>
                      Schema: {room.schemaId.slice(0, 10)}...{room.schemaId.slice(-8)}
                    </RoomCardDetail>
                    <RoomCardMetadata>
                      <Badge variant="default">
                        Owner: {formatAddress(room.ownerAddress)}
                      </Badge>
                      <Badge variant="primary">
                        Updated {formatDate(room.updatedAt)}
                      </Badge>
                    </RoomCardMetadata>
                  </RoomCard>
                ))}
              </RoomList>
            )}
          </TabContent>
        )}

        {activeTab === 'create' && (
          <TabContent
            key="create-tab"
            initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{
              duration: prefersReducedMotion ? 0 : motionTheme.duration.fast,
              ease: motionTheme.ease.out,
            }}
          >
        <Form onSubmit={handleCreateRoom}>
          <FormGroup>
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onBlur={() => setRoomNameTouched(true)}
              placeholder="Enter room name..."
              maxLength={ROOM_NAME_MAX}
              $hasError={roomNameTouched && !isRoomNameValid && newRoomName.length > 0}
              aria-describedby="room-name-validation"
              aria-invalid={roomNameTouched && !isRoomNameValid}
              required
            />
            <InputMetadata>
              <div style={{ flex: 1 }}>
                <ValidationFeedback
                  isValid={isRoomNameValid}
                  message={getRoomNameValidationMessage()}
                  show={roomNameTouched && newRoomName.length > 0}
                />
                {!(roomNameTouched && newRoomName.length > 0) && (
                  <HelperText>
                    Choose a unique name for your chat room ({ROOM_NAME_MIN}-{ROOM_NAME_MAX} characters)
                  </HelperText>
                )}
              </div>
              <CharacterCounter current={newRoomName.length} max={ROOM_NAME_MAX} />
            </InputMetadata>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="schemaId">Schema ID</Label>
            <Input
              id="schemaId"
              type="text"
              value={newRoomSchemaId}
              onChange={(e) => setNewRoomSchemaId(e.target.value)}
              onBlur={() => setSchemaIdTouched(true)}
              placeholder="0x..."
              $hasError={schemaIdTouched && !isSchemaIdValid}
              $mono
              aria-describedby="schema-id-validation"
              aria-invalid={schemaIdTouched && !isSchemaIdValid}
              required
            />
            <InputMetadata>
              <div style={{ flex: 1 }}>
                <ValidationFeedback
                  isValid={isSchemaIdValid}
                  message={getSchemaIdValidationMessage()}
                  show={schemaIdTouched}
                />
                {!schemaIdTouched && (
                  <HelperText>
                    32-byte hex string (0x followed by 64 hex characters)
                  </HelperText>
                )}
              </div>
            </InputMetadata>
          </FormGroup>

          <Button 
            type="submit" 
            disabled={loading || (roomNameTouched && !isRoomNameValid) || (schemaIdTouched && !isSchemaIdValid)}
          >
            {loading ? 'Creating Room...' : 'Create Room'}
          </Button>
        </Form>
          </TabContent>
        )}
      </AnimatePresence>
    </AccessibleModal>
  );
}

export default RoomModal;
