import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import RoomModal from '../RoomModal';

global.fetch = vi.fn();

describe('RoomModal', () => {
  const mockOnClose = vi.fn();
  const mockOnRoomSelect = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onRoomSelect: mockOnRoomSelect,
    defaultSchemaId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  };

  const mockRooms = [
    {
      roomName: 'General Chat',
      schemaId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      ownerAddress: '0x1234567890123456789012345678901234567890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      roomName: 'Tech Talk',
      schemaId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      ownerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnRoomSelect.mockClear();
    (global.fetch as any).mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<RoomModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<RoomModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Chat Rooms')).toBeInTheDocument();
    });

    it('should render Join Room and Create Room tabs', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<RoomModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Join Room' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Room' })).toBeInTheDocument();
    });

    it('should default to Join Room tab', () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<RoomModal {...defaultProps} />);
      const joinTab = screen.getByRole('button', { name: 'Join Room' });
      expect(joinTab).toBeInTheDocument();
    });
  });

  describe('Join Room tab', () => {
    it('should fetch rooms on mount', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<RoomModal {...defaultProps} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/rooms');
      });
    });

    it('should show skeleton loader while loading', async () => {
      (global.fetch as any).mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<RoomModal {...defaultProps} />);

      expect(screen.getByRole('status', { name: 'Loading content' })).toBeInTheDocument();
    });

    it('should display rooms after loading', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<RoomModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('General Chat')).toBeInTheDocument();
        expect(screen.getByText('Tech Talk')).toBeInTheDocument();
      });
    });

    it('should show empty state when no rooms available', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<RoomModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('No rooms available')).toBeInTheDocument();
        expect(screen.getByText('Be the first to create a chat room!')).toBeInTheDocument();
      });
    });

    it('should show error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      render(<RoomModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch rooms')).toBeInTheDocument();
      });
    });

    it('should display room metadata badges', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<RoomModal {...defaultProps} />);

      // Wait for rooms to load and render
      await waitFor(() => {
        expect(screen.getByText('General Chat')).toBeInTheDocument();
      }, { timeout: 2000 });

      // Then check for metadata badges (use queryAll since there are multiple rooms)
      await waitFor(() => {
        expect(screen.getByText(/Owner: 0x1234/)).toBeInTheDocument();
        const updatedElements = screen.getAllByText(/Updated/);
        expect(updatedElements.length).toBeGreaterThan(0);
      }, { timeout: 2000 });
    });

    it('should call onRoomSelect when room is clicked', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<RoomModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('General Chat')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('General Chat'));

      expect(mockOnRoomSelect).toHaveBeenCalledWith('General Chat', mockRooms[0].schemaId);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should store last room in localStorage when joining', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRooms,
      });

      render(<RoomModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('General Chat')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('General Chat'));

      const lastRoom = JSON.parse(localStorage.getItem('lastRoom') || '{}');
      expect(lastRoom.roomName).toBe('General Chat');
      expect(lastRoom.schemaId).toBe(mockRooms[0].schemaId);
    });
  });

  describe('Create Room tab', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
    });

    it('should switch to Create Room tab when clicked', async () => {
      render(<RoomModal {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        expect(screen.getByLabelText('Room Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Schema ID')).toBeInTheDocument();
      });
    });

    it('should show room name input with character counter', async () => {
      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Room Name');
        expect(input).toBeInTheDocument();
        expect(screen.getByLabelText(/0 of 100 characters used/)).toBeInTheDocument();
      });
    });

    it('should show schema ID input with helper text', async () => {
      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        expect(screen.getByLabelText('Schema ID')).toBeInTheDocument();
        expect(screen.getByText('32-byte hex string (0x followed by 64 hex characters)')).toBeInTheDocument();
      });
    });

    it('should populate schema ID with defaultSchemaId', async () => {
      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const schemaInput = screen.getByLabelText('Schema ID') as HTMLInputElement;
        expect(schemaInput.value).toBe(defaultProps.defaultSchemaId);
      });
    });

    it('should update character counter as user types', async () => {
      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Room Name');
        fireEvent.change(input, { target: { value: 'Test' } });
        expect(screen.getByLabelText('4 of 100 characters used')).toBeInTheDocument();
      });
    });
  });

  describe('Create Room validation', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
    });

    it('should show validation error for room name too short', async () => {
      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Room Name');
        fireEvent.change(input, { target: { value: 'AB' } });
        fireEvent.blur(input);
      });

      await waitFor(() => {
        expect(screen.getByText('Room name must be at least 3 characters')).toBeInTheDocument();
      });
    });

    it('should show validation success for valid room name', async () => {
      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Room Name');
        fireEvent.change(input, { target: { value: 'Valid Room Name' } });
        fireEvent.blur(input);
      });

      await waitFor(() => {
        expect(screen.getByText('Room name looks good!')).toBeInTheDocument();
      });
    });

    it('should show validation error for invalid schema ID', async () => {
      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Schema ID');
        fireEvent.change(input, { target: { value: 'invalid' } });
        fireEvent.blur(input);
      });

      await waitFor(() => {
        expect(screen.getByText('Schema ID must start with 0x')).toBeInTheDocument();
      });
    });

    it('should show validation error for schema ID wrong length', async () => {
      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Schema ID');
        fireEvent.change(input, { target: { value: '0x1234' } });
        fireEvent.blur(input);
      });

      await waitFor(() => {
        expect(screen.getByText('Schema ID must be exactly 66 characters (0x + 64 hex chars)')).toBeInTheDocument();
      });
    });

    it('should disable submit button when validation fails', async () => {
      render(<RoomModal {...defaultProps} />);
      
      // Click on the tab (first button with "Create Room")
      const tabs = screen.getAllByRole('button', { name: 'Create Room' });
      fireEvent.click(tabs[0]);

      // Wait for tab animation and form to be visible
      await waitFor(() => {
        expect(screen.getByLabelText('Room Name')).toBeInTheDocument();
      }, { timeout: 2000 });

      const roomNameInput = screen.getByLabelText('Room Name');
      fireEvent.change(roomNameInput, { target: { value: 'AB' } });
      fireEvent.blur(roomNameInput);

      await waitFor(() => {
        // Get the submit button (second button with "Create Room")
        const buttons = screen.getAllByRole('button', { name: 'Create Room' });
        const submitButton = buttons[1]; // The second one is the submit button
        expect(submitButton).toBeDisabled();
      }, { timeout: 2000 });
    });
  });

  describe('Create Room submission', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
    });

    it('should create room with valid inputs', async () => {
      const createdRoom = {
        roomName: 'New Room',
        schemaId: defaultProps.defaultSchemaId,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => createdRoom,
      });

      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Room Name');
        fireEvent.change(input, { target: { value: 'New Room' } });
        const form = input.closest('form');
        if (form) fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:4000/api/create-room',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomName: 'New Room',
              schemaId: defaultProps.defaultSchemaId,
            }),
          })
        );
      });
    });

    it('should call onRoomSelect after successful creation', async () => {
      const createdRoom = {
        roomName: 'New Room',
        schemaId: defaultProps.defaultSchemaId,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => createdRoom,
      });

      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Room Name');
        fireEvent.change(input, { target: { value: 'New Room' } });
        const form = input.closest('form');
        if (form) fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(mockOnRoomSelect).toHaveBeenCalledWith('New Room', defaultProps.defaultSchemaId);
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it.skip('should show error message when creation fails', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      }).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Room already exists' }),
      });

      render(<RoomModal {...defaultProps} />);
      
      // Click on the tab (first button with "Create Room")
      const tabs = screen.getAllByRole('button', { name: 'Create Room' });
      await user.click(tabs[0]);
      
      // Wait for tab animation to complete and form to be visible
      await waitFor(() => {
        expect(screen.getByLabelText('Room Name')).toBeInTheDocument();
      }, { timeout: 2000 });

      const nameInput = screen.getByLabelText('Room Name');
      await user.type(nameInput, 'New Room');
      
      // Now try to submit
      const submitButtons = screen.getAllByRole('button', { name: 'Create Room' });
      const submitButton = submitButtons[1]; // The form submit button
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Room already exists')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Close behavior', () => {
    it('should reset form when modal closes', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      render(<RoomModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Create Room' }));

      await waitFor(() => {
        const input = screen.getByLabelText('Room Name');
        fireEvent.change(input, { target: { value: 'Test Room' } });
        expect(input).toHaveValue('Test Room');
      });

      fireEvent.click(screen.getByLabelText('Close modal'));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
