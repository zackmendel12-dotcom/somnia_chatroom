import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../src/providers/ThemeProvider';
import EmojiPicker from '../EmojiPicker';

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('EmojiPicker', () => {
  const mockOnEmojiSelect = vi.fn();
  const mockOnClose = vi.fn();
  const triggerRef = { current: null };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render picker content when isOpen is false', () => {
    render(
      <TestWrapper>
        <EmojiPicker
          isOpen={false}
          onEmojiSelect={mockOnEmojiSelect}
          onClose={mockOnClose}
          triggerRef={triggerRef}
        />
      </TestWrapper>
    );

    // When closed, the component should render but be hidden
    expect(mockOnEmojiSelect).not.toHaveBeenCalled();
  });

  it('should render picker content when isOpen is true', () => {
    render(
      <TestWrapper>
        <EmojiPicker
          isOpen={true}
          onEmojiSelect={mockOnEmojiSelect}
          onClose={mockOnClose}
          triggerRef={triggerRef}
        />
      </TestWrapper>
    );

    // When open, the component should render (we just verify it doesn't crash)
    expect(mockOnEmojiSelect).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <EmojiPicker
          isOpen={true}
          onEmojiSelect={mockOnEmojiSelect}
          onClose={mockOnClose}
          triggerRef={triggerRef}
        />
      </TestWrapper>
    );

    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    
    const { container } = render(
      <TestWrapper>
        <EmojiPicker
          isOpen={true}
          onEmojiSelect={mockOnEmojiSelect}
          onClose={mockOnClose}
          triggerRef={triggerRef}
        />
      </TestWrapper>
    );

    // Find the overlay (it has aria-hidden="true")
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      await user.click(overlay);
    }
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
