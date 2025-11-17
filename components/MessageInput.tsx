import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import SendIcon from './icons/SendIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

interface InputWrapperProps {
  $isFocused: boolean;
  $hasContent: boolean;
}

const ComposerForm = styled.form`
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
  
  ${props => props.$hasContent && `
    border-color: ${props.theme.colors.accent};
  `}
  
  &:hover {
    border-color: ${props => props.theme.colors.accent};
  }
  
  @media (prefers-contrast: more) {
    border-width: 3px;
  }
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
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.radius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.5;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.surfaceLight};
    color: ${props => props.theme.colors.text};
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

const SendButton = styled.button`
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
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.accentDark};
    box-shadow: ${props => props.theme.shadows.md};
    transform: scale(1.05);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.surfaceLight};
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            type="button"
            disabled
            title="Add emoji (coming soon)"
            aria-label="Add emoji (coming soon)"
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
      <SendButton
        type="submit"
        disabled={isLoading || !text.trim()}
        aria-label={isLoading ? 'Sending message' : 'Send message'}
      >
        {isLoading ? <SpinnerIcon /> : <SendIcon />}
      </SendButton>
    </ComposerForm>
  );
}

export default MessageInput;
