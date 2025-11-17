import React from 'react';
import styled from 'styled-components';

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

const Counter = styled.span<{ $isNearLimit: boolean; $isAtLimit: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme, $isAtLimit, $isNearLimit }) => 
    $isAtLimit ? theme.colors.error :
    $isNearLimit ? theme.colors.warning :
    theme.colors.textTertiary
  };
  font-weight: ${({ theme, $isNearLimit, $isAtLimit }) => 
    ($isNearLimit || $isAtLimit) ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal
  };
  line-height: ${({ theme }) => theme.typography.lineHeight.xs};
  transition: color 150ms ease-in-out;
`;

function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  const isNearLimit = current >= max * 0.9;
  const isAtLimit = current >= max;

  return (
    <Counter 
      $isNearLimit={isNearLimit} 
      $isAtLimit={isAtLimit}
      className={className}
      aria-label={`${current} of ${max} characters used`}
    >
      {current} / {max}
    </Counter>
  );
}

export default CharacterCounter;
