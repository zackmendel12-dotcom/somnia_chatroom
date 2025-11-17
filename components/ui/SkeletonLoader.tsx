import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  className?: string;
}

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonItem = styled.div<{ $height: string }>`
  height: ${({ $height }) => $height};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceLight} 0%,
    ${({ theme }) => theme.colors.border} 20%,
    ${({ theme }) => theme.colors.surfaceLight} 40%,
    ${({ theme }) => theme.colors.surfaceLight} 100%
  );
  background-size: 200% 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  animation: ${shimmer} 1.5s ease-in-out infinite;
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.6;
  }
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

function SkeletonLoader({ count = 3, height = '80px', className }: SkeletonLoaderProps) {
  return (
    <SkeletonContainer className={className} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} $height={height} />
      ))}
    </SkeletonContainer>
  );
}

export default SkeletonLoader;
