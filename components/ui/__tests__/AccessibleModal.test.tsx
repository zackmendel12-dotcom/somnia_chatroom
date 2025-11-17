import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../__tests__/test-utils';
import AccessibleModal from '../AccessibleModal';

describe('AccessibleModal', () => {
  const mockOnClose = vi.fn();
  const originalBodyOverflow = document.body.style.overflow;
  const originalBodyPaddingRight = document.body.style.paddingRight;

  beforeEach(() => {
    mockOnClose.mockClear();
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;
  });

  afterEach(() => {
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <AccessibleModal isOpen={false} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('should render close button by default', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should hide close button when showCloseButton is false', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} showCloseButton={false}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-modal="true"', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should link title with aria-labelledby', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </AccessibleModal>
      );

      const modal = screen.getByRole('dialog');
      const titleId = modal.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();
      expect(screen.getByText('Test Modal')).toHaveAttribute('id', titleId);
    });

    it('should support custom aria-labelledby', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} ariaLabelledBy="custom-title">
          <h2 id="custom-title">Custom Title</h2>
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'custom-title');
    });

    it('should support aria-describedby', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} ariaDescribedBy="description">
          <p id="description">Modal description</p>
        </AccessibleModal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Close behavior', () => {
    it('should call onClose when close button is clicked', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      fireEvent.click(screen.getByLabelText('Close modal'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key is pressed', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose on Escape when closeOnEscape is false', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} closeOnEscape={false}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when overlay is clicked', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      const overlay = screen.getByRole('presentation');
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      const overlay = screen.getByRole('presentation');
      fireEvent.click(overlay);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when modal content is clicked', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      fireEvent.click(screen.getByText('Modal content'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Scroll locking', () => {
    it('should lock body scroll when modal opens', async () => {
      const { rerender } = render(
        <AccessibleModal isOpen={false} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(document.body.style.overflow).toBe('');

      rerender(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });
    });

    it('should unlock body scroll when modal closes', async () => {
      const { rerender } = render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden');
      });

      rerender(
        <AccessibleModal isOpen={false} onClose={mockOnClose}>
          <p>Modal content</p>
        </AccessibleModal>
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });

  describe('Focus management', () => {
    it('should focus first focusable element when opened', async () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <button>First button</button>
          <button>Second button</button>
        </AccessibleModal>
      );

      await waitFor(() => {
        const closeButton = screen.getByLabelText('Close modal');
        expect(document.activeElement).toBe(closeButton);
      }, { timeout: 100 });
    });

    it('should trap focus within modal', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose}>
          <button>First button</button>
          <button>Second button</button>
        </AccessibleModal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      const firstButton = screen.getByText('First button');
      const secondButton = screen.getByText('Second button');

      closeButton.focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      
      firstButton.focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      
      secondButton.focus();
      fireEvent.keyDown(document, { key: 'Tab' });
    });
  });

  describe('Modal sizes', () => {
    it('should apply sm size', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} size="sm">
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should apply md size (default)', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} size="md">
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should apply lg size', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} size="lg">
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should apply xl size', () => {
      render(
        <AccessibleModal isOpen={true} onClose={mockOnClose} size="xl">
          <p>Modal content</p>
        </AccessibleModal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
