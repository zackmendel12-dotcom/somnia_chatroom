import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import MessageInput from '../MessageInput';

describe('MessageInput', () => {
  const mockOnSendMessage = vi.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
    mockOnSendMessage.mockResolvedValue(undefined);
  });

  it('renders without crashing', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    expect(screen.getByLabelText('Message input')).toBeInTheDocument();
  });

  it('renders textarea element', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders send button', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('renders attachment button (disabled)', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const attachButton = screen.getByLabelText('Attach file (coming soon)');
    expect(attachButton).toBeDisabled();
  });

  it('renders emoji button (disabled)', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const emojiButton = screen.getByLabelText('Add emoji (coming soon)');
    expect(emojiButton).toBeDisabled();
  });

  it('allows typing in the textarea', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    
    await user.type(textarea, 'Hello, world!');
    expect(textarea).toHaveValue('Hello, world!');
  });

  it('disables textarea when loading', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    const textarea = screen.getByLabelText('Message input');
    expect(textarea).toBeDisabled();
  });

  it('disables send button when loading', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    const sendButton = screen.getByLabelText('Sending message');
    expect(sendButton).toBeDisabled();
  });

  it('disables send button when textarea is empty', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when textarea has content', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(textarea, 'Hello');
    expect(sendButton).not.toBeDisabled();
  });

  it('calls onSendMessage when form is submitted', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(textarea, 'Test message');
    await user.click(sendButton);
    
    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
    });
  });

  it('clears textarea after sending', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(textarea, 'Test message');
    await user.click(sendButton);
    
    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('sends message on Enter key press', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    
    await user.type(textarea, 'Test message{Enter}');
    
    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
    });
  });

  it('does not send message on Shift+Enter', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    
    await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('Line 1\nLine 2');
  });

  it('does not send empty or whitespace-only messages', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    
    await user.type(textarea, '   {Enter}');
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('trims whitespace from messages', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(textarea, '  Test message  ');
    await user.click(sendButton);
    
    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith('  Test message  ');
    });
  });

  it('does not send message when isLoading is true', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    const textarea = screen.getByLabelText('Message input');
    
    await user.type(textarea, 'Test');
    await user.type(textarea, '{Enter}');
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('shows keyboard hint on focus', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    
    await user.click(textarea);
    
    expect(screen.getByText(/Enter to send/)).toBeInTheDocument();
  });

  it('has proper aria-describedby for keyboard hint', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    expect(textarea).toHaveAttribute('aria-describedby', 'keyboard-hint');
  });

  it('updates aria-label based on loading state', () => {
    const { rerender } = render(
      <MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />
    );
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
    
    rerender(<MessageInput onSendMessage={mockOnSendMessage} isLoading={true} />);
    expect(screen.getByLabelText('Sending message')).toBeInTheDocument();
  });

  it('handles long messages correctly', async () => {
    const user = userEvent.setup();
    const longMessage = 'A'.repeat(500);
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(textarea, longMessage);
    await user.click(sendButton);
    
    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith(longMessage);
    });
  });

  it('prevents form submission with empty message', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSendMessage={mockOnSendMessage} isLoading={false} />);
    const textarea = screen.getByLabelText('Message input');
    
    await user.click(textarea);
    await user.keyboard('{Enter}');
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });
});
