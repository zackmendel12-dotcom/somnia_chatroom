/**
 * Motion theme configuration for framer-motion
 * Centralizes timing and easing values that reference CSS custom properties
 */

export const motionTheme = {
  // Duration values (in seconds for framer-motion)
  duration: {
    instant: 0,
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
    slower: 0.6,
  },
  
  // Easing curves
  ease: {
    in: [0.4, 0, 1, 1] as const,
    out: [0, 0, 0.2, 1] as const,
    inOut: [0.4, 0, 0.2, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    spring: [0.175, 0.885, 0.32, 1.275] as const,
  },
  
  // Spring configurations
  spring: {
    soft: { type: 'spring' as const, stiffness: 100, damping: 15 },
    medium: { type: 'spring' as const, stiffness: 260, damping: 20 },
    stiff: { type: 'spring' as const, stiffness: 400, damping: 30 },
    bouncy: { type: 'spring' as const, stiffness: 300, damping: 10 },
  },
  
  // Common animation variants
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    fadeScale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
  },
};

export type MotionTheme = typeof motionTheme;
