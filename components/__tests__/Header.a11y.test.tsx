import { describe, it, expect, vi } from 'vitest';
import { render, screen } from './test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import Header from '../Header';

expect.extend(toHaveNoViolations);

// Mock wagmi
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    isConnected: false,
    address: undefined,
  })),
}));

// Mock RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button>Connect Wallet</button>,
}));

describe('Header Accessibility', () => {
  it('should not have accessibility violations when disconnected', async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper role attribute', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should have accessible status indicator', () => {
    render(<Header />);
    const statusIndicator = screen.getByRole('status');
    expect(statusIndicator).toHaveAttribute('aria-label', 'Disconnected');
  });

  it('should have proper heading structure', () => {
    render(<Header />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Somnia On-Chain Chat');
  });

  it('should have accessible navigation', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'User navigation');
  });

  it('should not have accessibility violations with connected state', async () => {
    const { useAccount } = await import('wagmi');
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    } as any);

    const { container } = render(
      <Header
        currentRoom="general"
        displayName="TestUser"
        onRoomClick={vi.fn()}
        onDisplayNameClick={vi.fn()}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible room button with proper aria-label', async () => {
    const { useAccount } = await import('wagmi');
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    } as any);

    const onRoomClick = vi.fn();
    render(
      <Header
        currentRoom="general"
        displayName="TestUser"
        onRoomClick={onRoomClick}
        onDisplayNameClick={vi.fn()}
      />
    );

    const roomButton = screen.getByRole('button', { name: /current room: general/i });
    expect(roomButton).toBeInTheDocument();
  });

  it('should have accessible display name button with proper aria-label', async () => {
    const { useAccount } = await import('wagmi');
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    } as any);

    const onDisplayNameClick = vi.fn();
    render(
      <Header
        currentRoom="general"
        displayName="TestUser"
        onRoomClick={vi.fn()}
        onDisplayNameClick={onDisplayNameClick}
      />
    );

    const displayNameButton = screen.getByRole('button', { name: /display name: testuser/i });
    expect(displayNameButton).toBeInTheDocument();
  });

  it('should have focus-visible styles on interactive elements', async () => {
    const { useAccount } = await import('wagmi');
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    } as any);

    render(
      <Header
        currentRoom="general"
        displayName="TestUser"
        onRoomClick={vi.fn()}
        onDisplayNameClick={vi.fn()}
      />
    );

    const roomButton = screen.getByRole('button', { name: /current room/i });
    expect(roomButton).toHaveClass('focus-visible:outline');
  });
});
