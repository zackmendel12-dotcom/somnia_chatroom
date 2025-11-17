import { useEffect, useState } from 'react';

/**
 * Custom hook that respects the user's prefers-reduced-motion preference
 * Returns true if reduced motion is preferred, false otherwise
 */
function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check initial value on mount
    if (typeof window === 'undefined') return false;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  });

  useEffect(() => {
    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Update state when preference changes
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };
    
    // Set initial value
    handleChange(mediaQuery);
    
    // Listen for changes (using both methods for compatibility)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
