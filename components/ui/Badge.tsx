import React from 'react';
import styled from 'styled-components';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const StyledBadge = styled.span<{ $variant: BadgeProps['variant'] }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.xs};
  white-space: nowrap;
  
  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary}15;
          color: ${theme.colors.primary};
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success}15;
          color: ${theme.colors.success};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning}15;
          color: ${theme.colors.warning};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.error}15;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background-color: ${theme.colors.surfaceLight};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <StyledBadge $variant={variant} className={className}>
      {children}
    </StyledBadge>
  );
}

export default Badge;
