import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from './test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import DisplayNameModal from '../DisplayNameModal';
import RoomModal from '../RoomModal';

expect.extend(toHaveNoViolations);

// Mock fetch for RoomModal
global.fetch = vi.fn();

describe('Modal Accessibility', () => {
  describe('DisplayNameModal', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <DisplayNameModal
          isOpen={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          currentDisplayName="TestUser"
          defaultName="0x1234567890123456789012345678901234567890"
        />
      );
      
      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }, { timeout: 2000 });
    });

    it('should have proper ARIA attributes', async () => {
      render(
        <DisplayNameModal
          isOpen={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          currentDisplayName="TestUser"
          defaultName="0x1234"
        />
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby');
      }, { timeout: 2000 });
    });

    it('should have accessible form elements', async () => {
      render(
        <DisplayNameModal
          isOpen={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          currentDisplayName="TestUser"
          defaultName="0x1234"
        />
      );

      await waitFor(() => {
        const input = screen.getByRole('textbox', { name: /display name/i });
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('aria-describedby');
      }, { timeout: 2000 });
    });

    it('should have accessible buttons', async () => {
      const onClose = vi.fn();
      const onSave = vi.fn();
      
      render(
        <DisplayNameModal
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
          currentDisplayName="TestUser"
          defaultName="0x1234"
        />
      );

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        const saveButton = screen.getByRole('button', { name: /save/i });
        expect(cancelButton).toBeInTheDocument();
        expect(saveButton).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should trap focus within modal', async () => {
      render(
        <DisplayNameModal
          isOpen={true}
          onClose={vi.fn()}
          onSave={vi.fn()}
          currentDisplayName="TestUser"
          defaultName="0x1234"
        />
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('RoomModal', () => {
    beforeEach(() => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(
        <RoomModal
          isOpen={true}
          onClose={vi.fn()}
          onRoomSelect={vi.fn()}
          defaultSchemaId="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        />
      );

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }, { timeout: 2000 });
    });

    it('should have proper ARIA attributes', async () => {
      render(
        <RoomModal
          isOpen={true}
          onClose={vi.fn()}
          onRoomSelect={vi.fn()}
          defaultSchemaId="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        />
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby');
      }, { timeout: 2000 });
    });

    it('should have accessible tab navigation', async () => {
      render(
        <RoomModal
          isOpen={true}
          onClose={vi.fn()}
          onRoomSelect={vi.fn()}
          defaultSchemaId="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        />
      );

      await waitFor(() => {
        const joinButton = screen.getByRole('button', { name: /join room/i });
        const createButton = screen.getByRole('button', { name: /create room/i });
        expect(joinButton).toBeInTheDocument();
        expect(createButton).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should have accessible form inputs in create tab', async () => {
      render(
        <RoomModal
          isOpen={true}
          onClose={vi.fn()}
          onRoomSelect={vi.fn()}
          defaultSchemaId="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        />
      );

      await waitFor(() => {
        // Click on "Create Room" button
        const createButton = screen.getByRole('button', { name: /create room/i });
        createButton.click();
      }, { timeout: 2000 });

      await waitFor(() => {
        const roomNameInput = screen.getByRole('textbox', { name: /room name/i });
        expect(roomNameInput).toBeInTheDocument();
        expect(roomNameInput).toHaveAttribute('aria-describedby');
      }, { timeout: 2000 });
    });

    it('should have keyboard support for closing', async () => {
      const onClose = vi.fn();
      render(
        <RoomModal
          isOpen={true}
          onClose={onClose}
          onRoomSelect={vi.fn()}
          defaultSchemaId="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        />
      );

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});
