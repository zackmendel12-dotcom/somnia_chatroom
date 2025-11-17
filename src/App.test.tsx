import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import EmptyState from '../components/shared/EmptyState';
import LoadingState from '../components/shared/LoadingState';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './providers/ThemeProvider';

describe('Layout Components', () => {
  it('renders EmptyState component correctly', () => {
    render(
      <ThemeProvider>
        <EmptyState
          title="Test Title"
          description="Test Description"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders LoadingState component correctly', () => {
    render(
      <ThemeProvider>
        <LoadingState message="Loading test..." />
      </ThemeProvider>
    );

    expect(screen.getByText('Loading test...')).toBeInTheDocument();
  });

  it('renders EmptyState with action button', () => {
    const mockAction = { label: 'Click Me', onClick: () => {} };
    
    render(
      <ThemeProvider>
        <EmptyState
          title="Test"
          action={mockAction}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});
