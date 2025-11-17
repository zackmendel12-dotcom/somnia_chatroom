import React from 'react';
import styled from 'styled-components';

interface ValidationFeedbackProps {
  isValid: boolean;
  message: string;
  show?: boolean;
}

const FeedbackContainer = styled.div<{ $isValid: boolean; $show: boolean }>`
  display: ${({ $show }) => $show ? 'flex' : 'none'};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme, $isValid }) => $isValid ? theme.colors.success : theme.colors.error};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm};
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

function ValidationFeedback({ isValid, message, show = true }: ValidationFeedbackProps) {
  if (!show) return null;

  return (
    <FeedbackContainer $isValid={isValid} $show={show} role="alert" aria-live="polite">
      <Icon>
        {isValid ? (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </Icon>
      {message}
    </FeedbackContainer>
  );
}

export default ValidationFeedback;
