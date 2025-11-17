import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useReducedMotion from '../../src/hooks/useReducedMotion';
import { motionTheme } from '../../src/config/motionTheme';

interface LayoutShellProps {
  children: React.ReactNode;
  className?: string;
}

const Shell = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.background} 0%,
    color-mix(in srgb, ${({ theme }) => theme.colors.surface} 50%, ${({ theme }) => theme.colors.background}) 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at 30% 20%,
      color-mix(in srgb, ${({ theme }) => theme.colors.accent} 5%, transparent) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 80%,
      color-mix(in srgb, ${({ theme }) => theme.colors.primary} 3%, transparent) 0%,
      transparent 50%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

function LayoutShell({ children, className }: LayoutShellProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Shell 
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : motionTheme.duration.normal,
        ease: motionTheme.ease.out,
      }}
    >
      <Content>{children}</Content>
    </Shell>
  );
}

export default LayoutShell;
