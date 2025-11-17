import React from 'react';
import styled from 'styled-components';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  min-height: 300px;
  background: linear-gradient(135deg, 
    color-mix(in srgb, ${({ theme }) => theme.colors.surface} 80%, transparent),
    color-mix(in srgb, ${({ theme }) => theme.colors.surfaceLight} 60%, transparent)
  );
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textTertiary};
  opacity: 0.6;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentDark};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, ${({ theme }) => theme.colors.accent} 30%, transparent);
  }
`;

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Container>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action && (
        <ActionButton onClick={action.onClick}>
          {action.label}
        </ActionButton>
      )}
    </Container>
  );
}

export default EmptyState;
