import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../components/__tests__/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';

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

// Mock useSomniaService
vi.mock('../hooks/useSomniaService', () => ({
  useSomniaService: vi.fn(() => null),
}));

describe('App Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should not have accessibility violations when disconnected', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have skip-to-content link', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should have main content with id', () => {
    render(<App />);
    const mainContent = document.querySelector('#main-content');
    expect(mainContent).toBeInTheDocument();
  });

  it('should have proper heading hierarchy', () => {
    render(<App />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
  });

  it('should have proper landmark regions', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(2); // User navigation and utility controls
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should have accessible empty state', () => {
    render(<App />);
    expect(screen.getByText('Welcome to Somnia Chat')).toBeInTheDocument();
    expect(screen.getByText(/Connect your wallet to start chatting/i)).toBeInTheDocument();
  });

  it('should not have accessibility violations when connected but no room selected', async () => {
    const { useAccount } = await import('wagmi');
    const { useSomniaService } = await import('../hooks/useSomniaService');
    
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    } as any);
    
    vi.mocked(useSomniaService).mockReturnValue({
      registerChatSchema: vi.fn(),
      publishMessage: vi.fn(),
      subscribeToMessages: vi.fn(),
      unsubscribe: vi.fn(),
    } as any);

    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible room selection state', async () => {
    const { useAccount } = await import('wagmi');
    const { useSomniaService } = await import('../hooks/useSomniaService');
    
    vi.mocked(useAccount).mockReturnValue({
      isConnected: true,
      address: '0x1234567890123456789012345678901234567890',
    } as any);
    
    vi.mocked(useSomniaService).mockReturnValue({
      registerChatSchema: vi.fn(),
      publishMessage: vi.fn(),
      subscribeToMessages: vi.fn(),
      unsubscribe: vi.fn(),
    } as any);

    render(<App />);
    expect(screen.getByText('Select a Room')).toBeInTheDocument();
    const browseButton = screen.getByRole('button', { name: /browse rooms/i });
    expect(browseButton).toBeInTheDocument();
  });

  it('should have proper aria-live regions for status updates', () => {
    render(<App />);
    const statusIndicators = screen.getAllByRole('status');
    // Should have at least one status indicator
    expect(statusIndicators.length).toBeGreaterThan(0);
    // At least one should have aria-live
    const liveStatuses = statusIndicators.filter(el => el.hasAttribute('aria-live'));
    expect(liveStatuses.length).toBeGreaterThan(0);
  });
});
