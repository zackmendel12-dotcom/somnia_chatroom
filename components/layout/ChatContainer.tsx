import React from 'react';
import styled from 'styled-components';

interface ChatContainerProps {
  children: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  gap: 0;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 0;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: 768px) {
    border-radius: ${({ theme }) => theme.radius.xl};
  }
`;

const ScrollableContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.background},
    color-mix(in srgb, ${({ theme }) => theme.colors.surface} 80%, ${({ theme }) => theme.colors.background})
  );

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl};
    gap: ${({ theme }) => theme.spacing.lg};
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.full};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const ComposerPanel = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

function ChatContainer({ children }: ChatContainerProps) {
  return (
    <Container>
      <InnerContainer>{children}</InnerContainer>
    </Container>
  );
}

export { ChatContainer, ScrollableContent, ComposerPanel };
