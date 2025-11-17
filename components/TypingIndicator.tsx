import React from 'react';
import styled from 'styled-components';

const IndicatorContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${props => props.theme.spacing.sm};
  justify-content: flex-start;
  margin-top: ${props => props.theme.spacing.md};
  
  @media (prefers-reduced-motion: no-preference) {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: min(28rem, 70%);
  align-items: flex-start;
`;

const IndicatorBubble = styled.div`
  position: relative;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.radius.xl};
  background-color: ${props => props.theme.colors.surfaceLight};
  color: ${props => props.theme.colors.text};
  border-bottom-left-radius: ${props => props.theme.spacing.xs};
  box-shadow: ${props => props.theme.shadows.sm};
  
  @media (prefers-contrast: more) {
    border: 1px solid ${props => props.theme.colors.border};
  }
`;

const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  min-height: 1.25rem;
`;

interface DotProps {
  $delay: number;
}

const Dot = styled.span<DotProps>`
  width: 0.5rem;
  height: 0.5rem;
  background-color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.radius.full};
  opacity: 0.7;
  
  @media (prefers-reduced-motion: no-preference) {
    animation: bounce 1.4s ease-in-out infinite;
    animation-delay: ${props => props.$delay}s;
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: pulse 2s ease-in-out infinite;
    animation-delay: ${props => props.$delay}s;
  }
  
  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-0.375rem);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }
`;

function TypingIndicator() {
  return (
    <IndicatorContainer
      role="status"
      aria-live="polite"
      aria-label="Someone is typing"
    >
      <IndicatorContent>
        <IndicatorBubble>
          <DotsContainer>
            <Dot $delay={0} aria-hidden="true" />
            <Dot $delay={0.2} aria-hidden="true" />
            <Dot $delay={0.4} aria-hidden="true" />
          </DotsContainer>
        </IndicatorBubble>
      </IndicatorContent>
    </IndicatorContainer>
  );
}

export default TypingIndicator;
