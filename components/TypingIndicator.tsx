import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useReducedMotion from '../src/hooks/useReducedMotion';
import { motionTheme } from '../src/config/motionTheme';

const IndicatorContainer = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  gap: ${props => props.theme.spacing.sm};
  justify-content: flex-start;
  margin-top: ${props => props.theme.spacing.md};
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

const Dot = styled(motion.span)`
  width: 0.5rem;
  height: 0.5rem;
  background-color: ${props => props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.radius.full};
  opacity: 0.7;
`;

function TypingIndicator() {
  const prefersReducedMotion = useReducedMotion();
  
  const bounceVariants = {
    initial: { y: 0, opacity: 0.7 },
    animate: { 
      y: [0, -6, 0],
      opacity: [0.7, 1, 0.7],
    },
  };
  
  const pulseVariants = {
    initial: { opacity: 0.4 },
    animate: { opacity: [0.4, 1, 0.4] },
  };
  
  const dotVariants = prefersReducedMotion ? pulseVariants : bounceVariants;

  return (
    <IndicatorContainer
      role="status"
      aria-live="polite"
      aria-label="Someone is typing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: motionTheme.duration.fast }}
    >
      <IndicatorContent>
        <IndicatorBubble>
          <DotsContainer>
            <Dot 
              aria-hidden="true"
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: prefersReducedMotion ? 2 : 1.4,
                repeat: Infinity,
                ease: motionTheme.ease.inOut,
                delay: 0,
              }}
            />
            <Dot 
              aria-hidden="true"
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: prefersReducedMotion ? 2 : 1.4,
                repeat: Infinity,
                ease: motionTheme.ease.inOut,
                delay: 0.2,
              }}
            />
            <Dot 
              aria-hidden="true"
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: prefersReducedMotion ? 2 : 1.4,
                repeat: Infinity,
                ease: motionTheme.ease.inOut,
                delay: 0.4,
              }}
            />
          </DotsContainer>
        </IndicatorBubble>
      </IndicatorContent>
    </IndicatorContainer>
  );
}

export default TypingIndicator;
