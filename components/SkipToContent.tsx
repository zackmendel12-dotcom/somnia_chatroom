import React from 'react';
import styled from 'styled-components';

const SkipLink = styled.a`
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 10000;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.accent};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-decoration: none;
  border-radius: 0 0 ${props => props.theme.radius.md} 0;
  box-shadow: ${props => props.theme.shadows.lg};
  transition: top 0.15s ease;

  &:focus {
    top: 0;
    outline: 3px solid ${props => props.theme.colors.accentDark};
    outline-offset: 2px;
  }
`;

function SkipToContent() {
  return (
    <SkipLink href="#main-content">
      Skip to main content
    </SkipLink>
  );
}

export default SkipToContent;
