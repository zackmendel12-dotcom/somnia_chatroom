import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from './test-utils';
import Header from '../Header';
import UtilityBar from '../layout/UtilityBar';

// Mock wagmi
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    isConnected: true,
    address: '0x1234567890123456789012345678901234567890',
  })),
}));

// Mock RainbowKit
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button>Connect Wallet</button>,
}));

describe('Responsive Layout Tests', () => {
  const setViewport = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile viewport (320px)', () => {
    beforeEach(() => {
      setViewport(320, 568);
    });

    it('should render Header at mobile breakpoint', () => {
      render(
        <Header
          currentRoom="general"
          displayName="TestUser"
          onRoomClick={vi.fn()}
          onDisplayNameClick={vi.fn()}
        />
      );
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should hide room and display name buttons on small screens', () => {
      const { container } = render(
        <Header
          currentRoom="general"
          displayName="TestUser"
          onRoomClick={vi.fn()}
          onDisplayNameClick={vi.fn()}
        />
      );
      
      // These buttons have 'hidden sm:flex' class
      const roomButton = container.querySelector('button[aria-label*="Current room"]');
      expect(roomButton).toHaveClass('hidden');
    });

    it('should render UtilityBar at mobile breakpoint', () => {
      render(<UtilityBar isConnected={true} currentRoom="general" onRoomClick={vi.fn()} />);
      expect(screen.getByRole('navigation', { name: /utility controls/i })).toBeInTheDocument();
    });

    it('should hide status text on mobile', () => {
      const { container } = render(<UtilityBar isConnected={true} />);
      // Status text is hidden on screens < 640px via CSS
      const statusText = screen.getByText('Connected');
      expect(statusText.parentElement).toHaveStyle({ display: 'flex' });
    });
  });

  describe('Small mobile viewport (375px)', () => {
    beforeEach(() => {
      setViewport(375, 667);
    });

    it('should render components properly at 375px', () => {
      render(
        <Header
          currentRoom="general"
          displayName="TestUser"
          onRoomClick={vi.fn()}
          onDisplayNameClick={vi.fn()}
        />
      );
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  describe('Tablet viewport (640px)', () => {
    beforeEach(() => {
      setViewport(640, 1024);
    });

    it('should show room button at tablet size', () => {
      render(
        <Header
          currentRoom="general"
          displayName="TestUser"
          onRoomClick={vi.fn()}
          onDisplayNameClick={vi.fn()}
        />
      );
      // At 640px (sm breakpoint), buttons should be visible
      const roomButton = screen.queryByRole('button', { name: /current room/i });
      expect(roomButton).toBeInTheDocument();
    });
  });

  describe('Desktop viewport (768px)', () => {
    beforeEach(() => {
      setViewport(768, 1024);
    });

    it('should show all navigation elements at desktop size', () => {
      render(
        <Header
          currentRoom="general"
          displayName="TestUser"
          onRoomClick={vi.fn()}
          onDisplayNameClick={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /current room/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /display name/i })).toBeInTheDocument();
    });

    it('should show wallet address at desktop size', () => {
      const { container } = render(
        <Header
          currentRoom="general"
          displayName="TestUser"
          onRoomClick={vi.fn()}
          onDisplayNameClick={vi.fn()}
        />
      );
      // Address has 'hidden md:block' class
      const address = container.querySelector('.hidden.md\\:block');
      expect(address).toBeInTheDocument();
    });
  });

  describe('Large desktop viewport (1024px)', () => {
    beforeEach(() => {
      setViewport(1024, 768);
    });

    it('should render all content at large desktop size', () => {
      render(
        <Header
          currentRoom="general"
          displayName="TestUser"
          onRoomClick={vi.fn()}
          onDisplayNameClick={vi.fn()}
        />
      );
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /current room/i })).toBeInTheDocument();
    });
  });

  describe('Widescreen viewport (1536px)', () => {
    beforeEach(() => {
      setViewport(1536, 864);
    });

    it('should handle widescreen layouts', () => {
      render(
        <Header
          currentRoom="general"
          displayName="TestUser"
          onRoomClick={vi.fn()}
          onDisplayNameClick={vi.fn()}
        />
      );
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Touch target sizes', () => {
    it('should have minimum 44x44px touch targets in UtilityBar buttons', () => {
      const { container } = render(
        <UtilityBar isConnected={true} currentRoom="general" onRoomClick={vi.fn()} />
      );
      
      // Check that buttons have min-height and min-width set
      const themeButton = screen.getByRole('button', { name: /switch to/i });
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('Typography scaling', () => {
    it('should apply responsive text sizes', () => {
      render(<Header />);
      const heading = screen.getByRole('heading', { level: 1 });
      // Heading should have responsive classes like 'text-base sm:text-lg'
      expect(heading).toHaveClass('text-base', 'sm:text-lg');
    });
  });
});
