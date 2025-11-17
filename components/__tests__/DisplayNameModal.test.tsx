import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from './test-utils';
import DisplayNameModal from '../DisplayNameModal';

describe('DisplayNameModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    currentDisplayName: '',
    defaultName: 'User123',
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<DisplayNameModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<DisplayNameModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Display Name')).toBeInTheDocument();
    });

    it('should display info box with context', () => {
      render(<DisplayNameModal {...defaultProps} />);
      expect(screen.getByText(/Choose a display name that will appear with your messages/)).toBeInTheDocument();
    });

    it('should show default name in input', () => {
      render(<DisplayNameModal {...defaultProps} />);
      const input = screen.getByLabelText('Your Display Name');
      expect(input).toHaveValue('User123');
    });

    it('should show current display name when provided', () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="CustomName" />);
      const input = screen.getByLabelText('Your Display Name');
      expect(input).toHaveValue('CustomName');
    });

    it('should show character counter', () => {
      render(<DisplayNameModal {...defaultProps} />);
      expect(screen.getByLabelText(/characters used/)).toBeInTheDocument();
    });

    it('should show helper text initially', () => {
      render(<DisplayNameModal {...defaultProps} />);
      expect(screen.getByText('2-50 characters')).toBeInTheDocument();
    });

    it('should show both Cancel and Save buttons', () => {
      render(<DisplayNameModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Display Name' })).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show validation feedback after blur with valid input', async () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="" />);
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: 'ValidName' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('Looks good!')).toBeInTheDocument();
      });
    });

    it('should show error for name too short', async () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="" />);
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: 'A' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      });
    });

    it('should validate name length in real-time', async () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="" />);
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: 'AB' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText('Looks good!')).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: 'A' } });
      
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      });
    });

    it('should enforce max length of 50 characters', () => {
      render(<DisplayNameModal {...defaultProps} />);
      const input = screen.getByLabelText('Your Display Name') as HTMLInputElement;
      
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('should update character counter as user types', () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="" />);
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: 'Test' } });
      
      expect(screen.getByLabelText('4 of 50 characters used')).toBeInTheDocument();
    });

    it('should disable submit button when invalid and touched', async () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="" />);
      const input = screen.getByLabelText('Your Display Name');
      const submitButton = screen.getByRole('button', { name: 'Save Display Name' });
      
      fireEvent.change(input, { target: { value: 'A' } });
      fireEvent.blur(input);
      
      const form = input.closest('form');
      if (form) fireEvent.submit(form);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Form submission', () => {
    it('should call onSave with trimmed name on valid submission', async () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="" />);
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: '  ValidName  ' } });
      const form = input.closest('form');
      if (form) fireEvent.submit(form);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith('ValidName');
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should not call onSave with invalid name', async () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="" />);
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: 'A' } });
      const form = input.closest('form');
      if (form) fireEvent.submit(form);

      await waitFor(() => {
        expect(mockOnSave).not.toHaveBeenCalled();
      });
    });

    it('should call onSave when clicking Save button', async () => {
      render(<DisplayNameModal {...defaultProps} />);
      const saveButton = screen.getByRole('button', { name: 'Save Display Name' });
      
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith('User123');
      });
    });
  });

  describe('Cancel behavior', () => {
    it('should reset form and call onClose when Cancel is clicked', () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="OriginalName" />);
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: 'ModifiedName' } });
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form when modal closes and reopens', async () => {
      const { rerender } = render(
        <DisplayNameModal {...defaultProps} currentDisplayName="OriginalName" />
      );
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: 'ModifiedName' } });
      expect(input).toHaveValue('ModifiedName');

      rerender(<DisplayNameModal {...defaultProps} isOpen={false} currentDisplayName="OriginalName" />);
      rerender(<DisplayNameModal {...defaultProps} isOpen={true} currentDisplayName="OriginalName" />);

      await waitFor(() => {
        expect(screen.getByLabelText('Your Display Name')).toHaveValue('OriginalName');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes on input', () => {
      render(<DisplayNameModal {...defaultProps} />);
      const input = screen.getByLabelText('Your Display Name');
      
      expect(input).toHaveAttribute('aria-describedby');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should set aria-invalid when field has error', async () => {
      render(<DisplayNameModal {...defaultProps} currentDisplayName="" />);
      const input = screen.getByLabelText('Your Display Name');
      
      fireEvent.change(input, { target: { value: 'A' } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should have accessible info box', () => {
      render(<DisplayNameModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');
      
      expect(dialog).toHaveAttribute('aria-describedby', 'display-name-description');
      expect(screen.getByText(/Choose a display name that will appear with your messages/)).toHaveAttribute('id', 'display-name-description');
    });
  });
});
