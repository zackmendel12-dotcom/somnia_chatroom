import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.95);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  min-height: 200px;
`;

const SpinnerWrapper = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  width: ${({ $size }) => 
    $size === 'sm' ? '32px' : 
    $size === 'md' ? '48px' : 
    '64px'};
  height: ${({ $size }) => 
    $size === 'sm' ? '32px' : 
    $size === 'md' ? '48px' : 
    '64px'};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  position: relative;
`;

const SpinnerRing = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid ${({ theme }) => theme.colors.surfaceLight};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.full};
  animation: ${spin} 0.8s linear infinite;
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  animation: ${pulse} 2s ease-in-out infinite;
`;

function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  return (
    <Container>
      <SpinnerWrapper $size={size}>
        <SpinnerRing />
      </SpinnerWrapper>
      <Message>{message}</Message>
    </Container>
  );
}

export default LoadingState;
