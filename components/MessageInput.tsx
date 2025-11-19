import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import SendIcon from './icons/SendIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import EmojiPicker from './EmojiPicker';
import useReducedMotion from '../src/hooks/useReducedMotion';
import { motionTheme } from '../src/config/motionTheme';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

interface InputWrapperProps {
  $isFocused: boolean;
  $hasContent: boolean;
  $isLoading: boolean;
}

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const ComposerForm = styled.form`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.surface};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const InputWrapper = styled.div<InputWrapperProps>`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.$isFocused ? props.theme.colors.accent : props.theme.colors.border};
  border-radius: ${props => props.theme.radius.xl};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${props => props.$isFocused ? props.theme.shadows.md : props.theme.shadows.sm};
  overflow: hidden;
  
  ${props => props.$hasContent && `
    border-color: ${props.theme.colors.accent};
  `}
  
  &:hover {
    border-color: ${props => props.theme.colors.accent};
  }
  
  @media (prefers-contrast: more) {
    border-width: 3px;
  }
  
  ${props => props.$isLoading && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        ${props.theme.colors.accent} 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      
      @media (prefers-reduced-motion: no-preference) {
        animation: ${shimmer} 1.5s ease-in-out infinite;
      }
      
      @media (prefers-reduced-motion: reduce) {
        opacity: 0.5;
        background: ${props.theme.colors.accent};
        animation: none;
      }
    }
  `}
`;

const StyledTextarea = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: ${props => props.theme.typography.lineHeight.base};
  color: ${props => props.theme.colors.text};
  padding: 0;
  min-height: 1.5rem;
  max-height: 10rem;
  overflow-y: auto;
  
  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &::-webkit-scrollbar {
    width: 0.375rem;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.full};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  margin-left: ${props => props.theme.spacing.sm};
`;

const IconButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: ${props => props.$isActive ? props.theme.colors.surfaceLight : 'transparent'};
  color: ${props => props.$isActive ? props.theme.colors.accent : props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.radius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${props => props.$isActive ? 1 : 0.5};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.surfaceLight};
    color: ${props => props.$isActive ? props.theme.colors.accent : props.theme.colors.text};
    opacity: 1;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.accent};
    outline-offset: 2px;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const SendButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.full};
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.accentDark};
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.surfaceLight};
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.accent};
    outline-offset: 2px;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const KeyboardHint = styled.span`
  position: absolute;
  bottom: -1.5rem;
  right: 0;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textTertiary};
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  
  ${InputWrapper}:focus-within & {
    opacity: 1;
  }
`;

function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      await onSendMessage(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      setText(newText);
      
      // Restore focus and cursor position after emoji insertion
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursorPosition = start + emoji.length;
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <ComposerForm onSubmit={handleSubmit}>
      <InputWrapper
        $isFocused={isFocused}
        $hasContent={text.length > 0}
        $isLoading={isLoading}
      >
        <StyledTextarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          disabled={isLoading}
          rows={1}
          aria-label="Message input"
          aria-describedby="keyboard-hint"
        />
        <ActionBar>
          <IconButton
            type="button"
            disabled
            title="Attach file (coming soon)"
            aria-label="Attach file (coming soon)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </IconButton>
          <IconButton
            ref={emojiButtonRef}
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            title={isEmojiPickerOpen ? "Close emoji picker" : "Add emoji"}
            aria-label={isEmojiPickerOpen ? "Close emoji picker" : "Add emoji"}
            aria-expanded={isEmojiPickerOpen}
            aria-haspopup="dialog"
            $isActive={isEmojiPickerOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </IconButton>
        </ActionBar>
        <KeyboardHint id="keyboard-hint">
          Enter to send • Shift+Enter for new line
        </KeyboardHint>
      </InputWrapper>
      <EmojiPicker
        isOpen={isEmojiPickerOpen}
        onEmojiSelect={handleEmojiSelect}
        onClose={() => setIsEmojiPickerOpen(false)}
        triggerRef={emojiButtonRef}
      />
      <SendButton
        type="submit"
        disabled={isLoading || !text.trim()}
        aria-label={isLoading ? 'Sending message' : 'Send message'}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
        transition={{
          duration: motionTheme.duration.fast,
          ease: motionTheme.ease.out,
        }}
      >
        {isLoading ? <SpinnerIcon /> : <SendIcon />}
      </SendButton>
    </ComposerForm>
  );
}

export default MessageInput;
