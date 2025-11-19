import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../src/providers/ThemeProvider';
import MessageInput from '../MessageInput';

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('MessageInput - Emoji Integration', () => {
  const mockOnSendMessage = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have an enabled emoji button', () => {
    render(
      <TestWrapper>
        <MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />
      </TestWrapper>
    );

    const emojiButton = screen.getByRole('button', { name: /add emoji/i });
    expect(emojiButton).toBeInTheDocument();
    expect(emojiButton).not.toBeDisabled();
  });

  it('should toggle emoji picker state when emoji button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />
      </TestWrapper>
    );

    const emojiButton = screen.getByRole('button', { name: /add emoji/i });
    
    // Initially button should indicate picker is closed
    expect(emojiButton).toHaveAttribute('aria-expanded', 'false');
    expect(emojiButton).toHaveAttribute('aria-label', 'Add emoji');

    // Click to open
    await user.click(emojiButton);
    
    // Button should now indicate picker is open
    expect(emojiButton).toHaveAttribute('aria-expanded', 'true');
    expect(emojiButton).toHaveAttribute('aria-label', 'Close emoji picker');

    // Click again to close
    await user.click(emojiButton);
    
    // Button should indicate picker is closed again
    expect(emojiButton).toHaveAttribute('aria-expanded', 'false');
    expect(emojiButton).toHaveAttribute('aria-label', 'Add emoji');
  });

  it('should close emoji picker state when Escape is pressed', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />
      </TestWrapper>
    );

    const emojiButton = screen.getByRole('button', { name: /add emoji/i });
    
    // Open the picker
    await user.click(emojiButton);
    expect(emojiButton).toHaveAttribute('aria-expanded', 'true');

    // Press Escape
    await user.keyboard('{Escape}');
    
    // Picker should be closed
    await waitFor(() => {
      expect(emojiButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('should show active state when emoji picker is open', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />
      </TestWrapper>
    );

    const emojiButton = screen.getByRole('button', { name: /add emoji/i });
    
    // Open the picker
    await user.click(emojiButton);
    
    await waitFor(() => {
      expect(emojiButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('should maintain message text when toggling emoji picker', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />
      </TestWrapper>
    );

    const textarea = screen.getByRole('textbox', { name: /message input/i });
    const emojiButton = screen.getByRole('button', { name: /add emoji/i });
    
    // Type some text
    await user.type(textarea, 'Hello world');
    expect(textarea).toHaveValue('Hello world');

    // Toggle emoji picker
    await user.click(emojiButton);
    
    await waitFor(() => {
      expect(emojiButton).toHaveAttribute('aria-expanded', 'true');
    });

    // Text should still be there
    expect(textarea).toHaveValue('Hello world');

    // Close picker
    await user.click(emojiButton);
    
    // Text should still be there
    expect(textarea).toHaveValue('Hello world');
  });

  it('should have proper ARIA attributes for accessibility', () => {
    render(
      <TestWrapper>
        <MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />
      </TestWrapper>
    );

    const emojiButton = screen.getByRole('button', { name: /add emoji/i });
    
    expect(emojiButton).toHaveAttribute('aria-label');
    expect(emojiButton).toHaveAttribute('aria-expanded');
    expect(emojiButton).toHaveAttribute('aria-haspopup', 'dialog');
  });
});
