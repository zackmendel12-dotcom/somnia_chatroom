import { describe, it, expect } from 'vitest';
import { render, screen } from './test-utils';
import TypingIndicator from '../TypingIndicator';

describe('TypingIndicator', () => {
  it('renders without crashing', () => {
    render(<TypingIndicator />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has proper aria-label for accessibility', () => {
    render(<TypingIndicator />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-label', 'Someone is typing');
  });

  it('has aria-live attribute for screen readers', () => {
    render(<TypingIndicator />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
  });

  it('renders three dots', () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots).toHaveLength(3);
  });

  it('dots have aria-hidden attribute', () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    dots.forEach(dot => {
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('is accessible to screen readers', () => {
    render(<TypingIndicator />);
    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAccessibleName('Someone is typing');
  });
});
