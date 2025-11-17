import { describe, it, expect } from 'vitest';
import { render, screen } from './test-utils';
import ChatBubble from '../ChatBubble';
import { Message } from '../../types';

const mockMessage: Message = {
  id: '1',
  text: 'Hello, world!',
  sender: 'self',
  timestamp: Date.now(),
  senderName: 'Test User',
  senderAddress: '0x1234567890123456789012345678901234567890',
  roomId: 'test-room',
};

describe('ChatBubble', () => {
  it('renders message text correctly', () => {
    render(<ChatBubble message={mockMessage} />);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('renders sender name correctly', () => {
    render(<ChatBubble message={mockMessage} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('renders timestamp correctly', () => {
    const message = { ...mockMessage, timestamp: new Date('2024-01-01T12:00:00').getTime() };
    render(<ChatBubble message={message} />);
    const timeElement = screen.getByRole('time');
    expect(timeElement).toBeInTheDocument();
  });

  it('applies self styling for self messages', () => {
    render(<ChatBubble message={{ ...mockMessage, sender: 'self' }} />);
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
  });

  it('applies other styling for other messages', () => {
    const otherMessage = { ...mockMessage, sender: 'other' as const };
    render(<ChatBubble message={otherMessage} />);
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
  });

  it('hides sender name when grouped', () => {
    render(<ChatBubble message={mockMessage} isGrouped={true} />);
    const senderName = screen.getByText('Test User');
    expect(senderName).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows sender name when not grouped', () => {
    render(<ChatBubble message={mockMessage} isGrouped={false} />);
    const senderName = screen.getByText('Test User');
    expect(senderName).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('has proper aria-label for accessibility', () => {
    render(<ChatBubble message={mockMessage} />);
    expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'Message from Test User');
  });

  it('has proper aria-label for self messages', () => {
    render(<ChatBubble message={{ ...mockMessage, sender: 'self' }} />);
    const bubble = screen.getByLabelText('Your message');
    expect(bubble).toBeInTheDocument();
  });

  it('has proper aria-label for other messages', () => {
    render(<ChatBubble message={{ ...mockMessage, sender: 'other' as const }} />);
    const bubbles = screen.getAllByLabelText('Message from Test User');
    expect(bubbles.length).toBeGreaterThan(0);
  });

  it('renders multi-line messages correctly', () => {
    const multiLineMessage = { ...mockMessage, text: 'Line 1\nLine 2\nLine 3' };
    render(<ChatBubble message={multiLineMessage} />);
    expect(screen.getByText((content, element) => {
      return element?.tagName === 'P' && element?.textContent === 'Line 1\nLine 2\nLine 3';
    })).toBeInTheDocument();
  });

  it('renders long messages correctly', () => {
    const longText = 'A'.repeat(500);
    const longMessage = { ...mockMessage, text: longText };
    render(<ChatBubble message={longMessage} />);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('has datetime attribute on timestamp', () => {
    const message = { ...mockMessage, timestamp: new Date('2024-01-01T12:00:00').getTime() };
    render(<ChatBubble message={message} />);
    const timeElement = screen.getByRole('time');
    expect(timeElement).toHaveAttribute('dateTime');
  });
});
