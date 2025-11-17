import React from 'react';
import styled from 'styled-components';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
  isGrouped?: boolean;
}

interface BubbleStyleProps {
  $isSelf: boolean;
  $isGrouped?: boolean;
}

const BubbleContainer = styled.div<BubbleStyleProps>`
  display: flex;
  align-items: flex-end;
  gap: ${props => props.theme.spacing.sm};
  justify-content: ${props => props.$isSelf ? 'flex-end' : 'flex-start'};
  margin-top: ${props => props.$isGrouped ? props.theme.spacing.xs : props.theme.spacing.md};
  
  @media (prefers-reduced-motion: no-preference) {
    animation: slideIn 0.2s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const BubbleContent = styled.div<BubbleStyleProps>`
  display: flex;
  flex-direction: column;
  max-width: min(28rem, 70%);
  align-items: ${props => props.$isSelf ? 'flex-end' : 'flex-start'};
`;

const SenderName = styled.span<BubbleStyleProps>`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  line-height: ${props => props.theme.typography.lineHeight.xs};
  margin-bottom: ${props => props.theme.spacing.xs};
  padding: 0 ${props => props.theme.spacing.xs};
  color: ${props => props.$isSelf ? props.theme.colors.accent : props.theme.colors.textSecondary};
  opacity: ${props => props.$isGrouped ? 0 : 1};
  height: ${props => props.$isGrouped ? 0 : 'auto'};
  overflow: hidden;
  transition: opacity 0.2s ease;
`;

const BubbleWrapper = styled.div<BubbleStyleProps>`
  position: relative;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.radius.xl};
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: ${props => props.theme.typography.lineHeight.sm};
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  word-wrap: break-word;
  box-shadow: ${props => props.theme.shadows.sm};
  
  ${props => props.$isSelf ? `
    background-color: ${props.theme.colors.accent};
    color: white;
    border-bottom-right-radius: ${props.theme.spacing.xs};
  ` : `
    background-color: ${props.theme.colors.surfaceLight};
    color: ${props.theme.colors.text};
    border-bottom-left-radius: ${props.theme.spacing.xs};
  `}
  
  @media (prefers-contrast: more) {
    border: 1px solid ${props => props.$isSelf ? props.theme.colors.accentDark : props.theme.colors.border};
  }
`;

const MessageText = styled.p`
  margin: 0;
  white-space: pre-wrap;
`;

const TimestampBadge = styled.time<BubbleStyleProps>`
  display: inline-flex;
  align-items: center;
  font-size: ${props => props.theme.typography.fontSize.xs};
  line-height: ${props => props.theme.typography.lineHeight.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs};
  opacity: 0.8;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

function ChatBubble({ message, isGrouped = false }: ChatBubbleProps) {
  const isSelf = message.sender === 'self';
  
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const formattedDateTime = new Date(message.timestamp).toISOString();

  return (
    <BubbleContainer
      $isSelf={isSelf}
      $isGrouped={isGrouped}
      role="article"
      aria-label={`Message from ${message.senderName}`}
    >
      <BubbleContent $isSelf={isSelf}>
        <SenderName
          $isSelf={isSelf}
          $isGrouped={isGrouped}
          aria-hidden={isGrouped}
        >
          {message.senderName}
        </SenderName>
        <BubbleWrapper
          $isSelf={isSelf}
          aria-label={isSelf ? 'Your message' : `Message from ${message.senderName}`}
        >
          <MessageText>{message.text}</MessageText>
        </BubbleWrapper>
        <TimestampBadge
          $isSelf={isSelf}
          dateTime={formattedDateTime}
          aria-label={`Sent at ${time}`}
        >
          {time}
        </TimestampBadge>
      </BubbleContent>
    </BubbleContainer>
  );
}

export default ChatBubble;
