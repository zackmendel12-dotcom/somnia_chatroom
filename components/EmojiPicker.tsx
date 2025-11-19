import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Picker, { Theme, EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { useThemeMode } from '../src/providers/ThemeProvider';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  isOpen: boolean;
  triggerRef?: React.RefObject<HTMLElement>;
}

const PickerWrapper = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  bottom: 3.5rem;
  right: 0;
  z-index: ${props => props.theme.zIndex.dropdown};
  display: ${props => props.$isOpen ? 'block' : 'none'};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  overflow: hidden;
  
  /* Responsive positioning */
  @media (max-width: 640px) {
    right: auto;
    left: 0;
  }
  
  /* Override emoji-picker-react styles to match our theme */
  .epr-main {
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.lg};
  }
  
  /* Custom scrollbar for emoji categories */
  .epr-emoji-category-content::-webkit-scrollbar {
    width: 0.5rem;
  }
  
  .epr-emoji-category-content::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }
  
  .epr-emoji-category-content::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.full};
  }
  
  .epr-emoji-category-content::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${props => props.theme.zIndex.dropdown - 1};
  display: ${props => props.$isOpen ? 'block' : 'none'};
  background: transparent;
`;

function EmojiPicker({ onEmojiSelect, onClose, isOpen, triggerRef }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const { mode } = useThemeMode();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    onClose();
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} aria-hidden="true" />
      <PickerWrapper ref={pickerRef} $isOpen={isOpen}>
        {isOpen && (
          <Picker
            onEmojiClick={handleEmojiClick}
            theme={mode === 'dark' ? Theme.DARK : Theme.LIGHT}
            width="100%"
            height="350px"
            previewConfig={{ showPreview: false }}
            searchDisabled
            skinTonesDisabled
            lazyLoadEmojis
            emojiStyle={EmojiStyle.NATIVE}
          />
        )}
      </PickerWrapper>
    </>
  );
}

export default EmojiPicker;
