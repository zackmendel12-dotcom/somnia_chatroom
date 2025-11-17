import React, { useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import type { BaseModalProps, ModalSizeKey } from './modal.types';
import { MODAL_SIZES } from './modal.types';

interface AccessibleModalProps extends BaseModalProps {
  children: React.ReactNode;
  size?: ModalSizeKey;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
  
  animation: ${fadeIn} 200ms ease-out;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: opacity 100ms ease-out;
  }
`;

const ModalContainer = styled.div<{ $size: ModalSizeKey }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: ${({ $size }) => MODAL_SIZES[$size].width};
  max-width: ${({ $size }) => MODAL_SIZES[$size].maxWidth};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  
  animation: ${slideIn} 250ms ease-out;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: all 150ms ease-out;
  }

  @media (max-width: 640px) {
    max-height: 95vh;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;

const ModalHeader = styled.div<{ $hasTitle: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $hasTitle }) => $hasTitle ? 'space-between' : 'flex-end'};
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.typography.lineHeight['2xl']};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 150ms ease-in-out;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.full};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

function AccessibleModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  ariaLabelledBy,
  ariaDescribedBy,
  className,
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus trap implementation
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, [isOpen, trapFocus]);

  // Scroll lock and focus management
  useEffect(() => {
    if (isOpen) {
      // Store current active element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Lock scroll
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Focus first focusable element or the modal itself
      setTimeout(() => {
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }
      }, 50);
    } else {
      // Unlock scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const titleId = ariaLabelledBy || (title ? 'modal-title' : undefined);
  
  return (
    <Overlay
      ref={overlayRef}
      $isOpen={isOpen}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <ModalContainer
        ref={modalRef}
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        className={className}
      >
        <ModalHeader $hasTitle={!!title}>
          {title && <ModalTitle id={titleId}>{title}</ModalTitle>}
          {showCloseButton && (
            <CloseButton
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </CloseButton>
          )}
        </ModalHeader>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </Overlay>
  );
}

export default AccessibleModal;
