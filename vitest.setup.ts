import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(matchers);
expect.extend(toHaveNoViolations);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  cleanup();
});

// Mock matchMedia for theme provider
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Set up mock environment variables for tests
process.env.VITE_SOMNIA_RPC_URL = 'http://localhost:8545';
process.env.VITE_SOMNIA_CHAIN_ID = '1234';
process.env.VITE_RAINBOWKIT_PROJECT_ID = 'test-project-id';
process.env.VITE_SOMNIA_SCHEMA_ID = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
process.env.VITE_API_BASE_URL = 'http://localhost:4000';
process.env.VITE_CHAT_SCHEMA = 'uint64 timestamp,bytes32 roomId,string content,string senderName,address sender';
