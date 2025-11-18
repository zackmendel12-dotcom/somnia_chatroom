# Design System Documentation

Comprehensive design system documentation for the Somnia On-Chain Chat application. This design system is built on a foundation of CSS custom properties, Tailwind CSS v4, styled-components, and TypeScript, ensuring consistency, accessibility, and maintainability across the entire application.

## Table of Contents

- [Overview](#overview)
- [Visual Foundations](#visual-foundations)
  - [Color Palette](#color-palette)
  - [Typography](#typography)
  - [Spacing](#spacing)
  - [Border Radius](#border-radius)
  - [Shadows](#shadows)
  - [Z-Index](#z-index)
- [Motion System](#motion-system)
  - [Duration Tokens](#duration-tokens)
  - [Easing Functions](#easing-functions)
  - [Animation Variants](#animation-variants)
  - [Reduced Motion](#reduced-motion)
- [Theme System](#theme-system)
  - [ThemeProvider](#themeprovider)
  - [useThemeMode Hook](#usethememode-hook)
  - [Light and Dark Modes](#light-and-dark-modes)
- [Usage Examples](#usage-examples)
  - [Using Tokens in Tailwind Classes](#using-tokens-in-tailwind-classes)
  - [Using Tokens in styled-components](#using-tokens-in-styled-components)
  - [Using Motion Utilities](#using-motion-utilities)
- [Responsive Design](#responsive-design)
  - [Breakpoints](#breakpoints)
  - [Fluid Typography](#fluid-typography)
  - [Responsive Patterns](#responsive-patterns)
- [Accessibility Conventions](#accessibility-conventions)
  - [Focus Management](#focus-management)
  - [ARIA Patterns](#aria-patterns)
  - [Touch Targets](#touch-targets)
  - [High Contrast Mode](#high-contrast-mode)
- [Component Inventory](#component-inventory)
  - [Layout Components](#layout-components)
  - [UI Components](#ui-components)
  - [Shared Components](#shared-components)
  - [Feature Components](#feature-components)
  - [Icon Components](#icon-components)
- [TypeScript Integration](#typescript-integration)
- [Resources](#resources)

---

## Overview

The Somnia On-Chain Chat design system is built with the following principles:

- **Token-based**: All design decisions are centralized as CSS custom properties
- **Type-safe**: Full TypeScript support with exported interfaces and types
- **Accessible**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **Responsive**: Fluid design from 320px mobile to 1536px+ widescreen
- **Themeable**: Built-in light/dark mode with system preference support
- **Motion-aware**: Respects user's `prefers-reduced-motion` preference

**Source files:**
- Design tokens: `src/styles/tailwind.css`
- Theme provider: `src/providers/ThemeProvider.tsx`
- Theme types: `src/styled.d.ts`
- Tailwind config: `tailwind.config.ts`
- Motion theme: `src/config/motionTheme.ts`

---

## Visual Foundations

### Color Palette

All colors are defined as CSS custom properties in `src/styles/tailwind.css` and automatically adapt based on the theme mode.

#### Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-primary` | `#6366f1` (Indigo 500) | `#818cf8` (Indigo 400) | Primary actions, links |
| `--color-primary-dark` | `#4f46e5` (Indigo 600) | `#6366f1` (Indigo 500) | Hover states |
| `--color-primary-light` | `#818cf8` (Indigo 400) | `#a5b4fc` (Indigo 300) | Subtle highlights |
| `--color-secondary` | `#8b5cf6` (Violet 500) | `#a78bfa` (Violet 400) | Secondary elements |
| `--color-accent` | `#818cf8` (Indigo 400) | `#818cf8` (Indigo 400) | Accents, highlights |
| `--color-accent-dark` | `#6366f1` (Indigo 500) | `#6366f1` (Indigo 500) | Accent hover states |

#### Surface Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-background` | `#ffffff` (White) | `#111827` (Gray 900) | Page background |
| `--color-surface` | `#f9fafb` (Gray 50) | `#1f2937` (Gray 800) | Cards, panels |
| `--color-surface-light` | `#f3f4f6` (Gray 100) | `#374151` (Gray 700) | Subtle surfaces |

#### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-text` | `#111827` (Gray 900) | `#f9fafb` (Gray 50) | Primary text |
| `--color-text-secondary` | `#6b7280` (Gray 500) | `#d1d5db` (Gray 300) | Secondary text |
| `--color-text-tertiary` | `#9ca3af` (Gray 400) | `#9ca3af` (Gray 400) | Tertiary text, placeholders |

#### Semantic Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-error` | `#ef4444` (Red 500) | `#f87171` (Red 400) | Errors, destructive actions |
| `--color-success` | `#10b981` (Green 500) | `#34d399` (Green 400) | Success states |
| `--color-warning` | `#f59e0b` (Amber 500) | `#fbbf24` (Amber 400) | Warnings, cautions |
| `--color-border` | `#e5e7eb` (Gray 200) | `#374151` (Gray 700) | Borders, dividers |

**Tailwind classes:** `bg-primary`, `text-accent`, `border-border`, etc.

**styled-components:** `theme.colors.primary`, `theme.colors.text`, etc.

---

### Typography

#### Font Family

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family-base` | `'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | All text |

**Font source:** `@fontsource-variable/inter` (imported in `src/styles/tailwind.css`)

**Features enabled:** `rlig` (contextual ligatures), `calt` (contextual alternates)

#### Font Sizes

| Token | Base Size | Fluid Range | Line Height | Usage |
|-------|-----------|-------------|-------------|-------|
| `--font-size-xs` | 0.75rem (12px) | 0.7rem - 0.75rem | 1rem | Small labels, captions |
| `--font-size-sm` | 0.875rem (14px) | 0.8rem - 0.875rem | 1.25rem | Body text (small) |
| `--font-size-base` | 1rem (16px) | 0.9rem - 1rem | 1.5rem | Body text (default) |
| `--font-size-lg` | 1.125rem (18px) | 1rem - 1.125rem | 1.75rem | Large body text |
| `--font-size-xl` | 1.25rem (20px) | 1.1rem - 1.25rem | 1.75rem | Subheadings |
| `--font-size-2xl` | 1.5rem (24px) | 1.25rem - 1.5rem | 2rem | Headings (h2) |
| `--font-size-3xl` | 1.875rem (30px) | 1.5rem - 1.875rem | 2.25rem | Headings (h1) |

**Note:** Font sizes use CSS `clamp()` for fluid scaling from 320px to desktop (see [Fluid Typography](#fluid-typography))

#### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-medium` | 500 | Emphasized text |
| `--font-weight-semibold` | 600 | Subheadings, buttons |
| `--font-weight-bold` | 700 | Headings |

**Tailwind classes:** `text-base`, `text-lg`, `font-semibold`, etc.

**styled-components:** `theme.typography.fontSize.base`, `theme.typography.fontWeight.semibold`, etc.

---

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | 0.25rem (4px) | Tight spacing |
| `--spacing-sm` | 0.5rem (8px) | Small gaps |
| `--spacing-md` | 1rem (16px) | Default spacing |
| `--spacing-lg` | 1.5rem (24px) | Large gaps |
| `--spacing-xl` | 2rem (32px) | Extra large gaps |
| `--spacing-2xl` | 3rem (48px) | Section spacing |
| `--spacing-3xl` | 4rem (64px) | Major section spacing |

**Tailwind classes:** `p-md`, `m-lg`, `gap-sm`, `space-y-xl`, etc.

**styled-components:** `theme.spacing.md`, `theme.spacing.lg`, etc.

---

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem (4px) | Small elements |
| `--radius-md` | 0.5rem (8px) | Buttons, inputs, cards |
| `--radius-lg` | 0.75rem (12px) | Large cards, panels |
| `--radius-xl` | 1rem (16px) | Modals, major surfaces |
| `--radius-full` | 9999px | Circular elements |

**Tailwind classes:** `rounded-md`, `rounded-lg`, `rounded-full`, etc.

**styled-components:** `theme.radius.md`, `theme.radius.lg`, etc.

---

### Shadows

Shadows automatically adapt to theme mode with increased opacity in dark mode.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `0 1px 2px 0 rgb(0 0 0 / 0.3)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | `0 4px 6px -1px rgb(0 0 0 / 0.4)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | `0 10px 15px -3px rgb(0 0 0 / 0.5)` | Elevated panels |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | `0 20px 25px -5px rgb(0 0 0 / 0.6)` | Modals |

**Tailwind classes:** `shadow-md`, `shadow-lg`, `shadow-xl`, etc.

**styled-components:** `theme.shadows.md`, `theme.shadows.lg`, etc.

---

### Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| `--z-index-base` | 0 | Default layer |
| `--z-index-dropdown` | 1000 | Dropdowns, popovers |
| `--z-index-modal` | 2000 | Modals, dialogs |
| `--z-index-tooltip` | 3000 | Tooltips, toasts |

**Tailwind classes:** `z-modal`, `z-tooltip`, etc.

**styled-components:** `theme.zIndex.modal`, `theme.zIndex.tooltip`, etc.

---

## Motion System

All animations are powered by **framer-motion** and respect the user's `prefers-reduced-motion` preference.

### Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 0ms | Immediate changes |
| `--duration-fast` | 150ms | Quick transitions |
| `--duration-normal` | 250ms | Default transitions |
| `--duration-slow` | 400ms | Deliberate animations |
| `--duration-slower` | 600ms | Emphasized animations |

**framer-motion:** Use values from `motionTheme.duration` (in seconds: 0, 0.15, 0.25, 0.4, 0.6)

---

### Easing Functions

| Token | CSS Bezier | framer-motion | Usage |
|-------|-----------|---------------|-------|
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | `[0.4, 0, 1, 1]` | Elements entering |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | `[0, 0, 0.2, 1]` | Elements exiting |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | `[0.4, 0, 0.2, 1]` | Smooth transitions |
| `--ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | `[0.68, -0.55, 0.265, 1.55]` | Playful bounces |
| `--ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | `[0.175, 0.885, 0.32, 1.275]` | Spring effects |

**Source:** `src/config/motionTheme.ts`

---

### Animation Variants

Pre-built animation variants for common patterns (defined in `motionTheme.variants`):

#### fadeIn
```tsx
initial: { opacity: 0 }
animate: { opacity: 1 }
exit: { opacity: 0 }
```

#### fadeScale
```tsx
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }
exit: { opacity: 0, scale: 0.95 }
```

#### slideUp
```tsx
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: 20 }
```

#### slideDown
```tsx
initial: { opacity: 0, y: -20 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -20 }
```

#### slideLeft
```tsx
initial: { opacity: 0, x: 20 }
animate: { opacity: 1, x: 0 }
exit: { opacity: 0, x: 20 }
```

#### slideRight
```tsx
initial: { opacity: 0, x: -20 }
animate: { opacity: 1, x: 0 }
exit: { opacity: 0, x: -20 }
```

---

### Reduced Motion

**Hook:** `useReducedMotion()` (from `src/hooks/useReducedMotion.ts`)

Returns `true` if the user prefers reduced motion, `false` otherwise. This hook listens to the `prefers-reduced-motion` media query and updates reactively.

**Usage:**
```tsx
import useReducedMotion from '@/hooks/useReducedMotion';
import { motion } from 'framer-motion';
import { motionTheme } from '@/config/motionTheme';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : motionTheme.duration.normal,
        ease: motionTheme.ease.out
      }}
    >
      Content
    </motion.div>
  );
}
```

**Best practices:**
- Always check `useReducedMotion()` in animated components
- Set `initial={prefersReducedMotion ? false : animationConfig}` to disable initial animations
- Set `duration: prefersReducedMotion ? 0 : duration` to skip animations entirely
- For continuous animations (like loading spinners), use simpler fallbacks (e.g., pulse instead of bounce)

---

## Theme System

### ThemeProvider

**Location:** `src/providers/ThemeProvider.tsx`

The `ThemeProvider` wraps the entire application and provides theme context to all components. It manages light/dark mode state and builds a theme object from CSS custom properties for use with styled-components.

**Features:**
- Light/dark mode toggle
- System preference detection (`prefers-color-scheme`)
- localStorage persistence (key: `theme-mode`)
- Automatic CSS variable reading and theme object construction
- Integration with styled-components `ThemeProvider`

**Usage in `src/main.tsx`:**
```tsx
import { ThemeProvider } from '@/providers/ThemeProvider';
import { WagmiProvider } from '@/providers/WagmiProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <WagmiProvider>
        <App />
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

**Theme Interface (`Theme`):**
```tsx
interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    accentDark: string;
    background: string;
    surface: string;
    surfaceLight: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  typography: {
    fontFamily: string;
    fontSize: { xs, sm, base, lg, xl, '2xl', '3xl' };
    lineHeight: { xs, sm, base, lg, xl, '2xl', '3xl' };
    fontWeight: { normal, medium, semibold, bold };
  };
  spacing: { xs, sm, md, lg, xl, '2xl', '3xl' };
  radius: { sm, md, lg, xl, full };
  shadows: { sm, md, lg, xl };
  zIndex: { base, dropdown, modal, tooltip };
}
```

---

### useThemeMode Hook

**Location:** `src/providers/ThemeProvider.tsx` (exported)

Custom hook to access and control theme mode from any component.

**Returns:**
```tsx
interface ThemeContextType {
  theme: Theme;           // Current theme object
  mode: ThemeMode;        // 'light' | 'dark'
  toggleTheme: () => void; // Toggle between light/dark
  setTheme: (mode: ThemeMode) => void; // Set specific mode
}
```

**Usage example:**
```tsx
import { useThemeMode } from '@/providers/ThemeProvider';

function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <button onClick={toggleTheme} aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      {mode === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

**See also:** `components/icons/ThemeIcon.tsx` for a full implementation with animated icons

---

### Light and Dark Modes

Theme modes are controlled via the `[data-theme]` attribute on the root `<html>` element:

- Light mode: `<html data-theme="light">` (or no attribute)
- Dark mode: `<html data-theme="dark">`

The `ThemeProvider` automatically:
1. Detects system preference on initial load
2. Reads saved preference from localStorage
3. Updates the DOM attribute when mode changes
4. Rebuilds the theme object from CSS variables

**CSS structure:**
```css
:root {
  /* Light mode tokens */
  --color-background: #ffffff;
  --color-text: #111827;
}

[data-theme='dark'] {
  /* Dark mode overrides */
  --color-background: #111827;
  --color-text: #f9fafb;
}
```

---

## Usage Examples

### Using Tokens in Tailwind Classes

Tailwind CSS v4 is configured to use CSS custom properties via `tailwind.config.ts`.

**Color classes:**
```tsx
<div className="bg-surface border border-border text-text">
  <button className="bg-accent hover:bg-accent-dark text-white">
    Click me
  </button>
</div>
```

**Typography classes:**
```tsx
<h1 className="text-3xl font-bold text-text">Heading</h1>
<p className="text-base font-normal text-text-secondary">Body text</p>
```

**Spacing classes:**
```tsx
<div className="p-md space-y-sm">
  <div className="mb-lg">Content</div>
</div>
```

**Responsive classes:**
```tsx
<div className="text-sm sm:text-base lg:text-lg">
  Scales from small to large
</div>
```

**Shadow and radius:**
```tsx
<div className="rounded-lg shadow-md p-md">
  Card content
</div>
```

---

### Using Tokens in styled-components

styled-components has access to the theme object via the `theme` prop.

**Basic usage:**
```tsx
import styled from 'styled-components';

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  &:hover {
    background: ${({ theme }) => theme.colors.accentDark};
  }
`;
```

**Accessing nested theme properties:**
```tsx
const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.xl};
`;
```

**TypeScript support:**

The theme is fully typed via `src/styled.d.ts`:
```tsx
import 'styled-components';
import type { Theme } from './providers/ThemeProvider';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

This enables full IntelliSense and type checking for theme properties.

---

### Using Motion Utilities

**Import motion theme and reduced motion hook:**
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { motionTheme } from '@/config/motionTheme';
import useReducedMotion from '@/hooks/useReducedMotion';
```

**Simple fade animation:**
```tsx
function FadeInComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : motionTheme.variants.fadeIn.initial}
      animate={motionTheme.variants.fadeIn.animate}
      transition={{ 
        duration: prefersReducedMotion ? 0 : motionTheme.duration.normal,
        ease: motionTheme.ease.out
      }}
    >
      Content
    </motion.div>
  );
}
```

**Slide up animation:**
```tsx
function SlideUpComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : motionTheme.variants.slideUp.initial}
      animate={motionTheme.variants.slideUp.animate}
      exit={prefersReducedMotion ? undefined : motionTheme.variants.slideUp.exit}
      transition={{ 
        duration: prefersReducedMotion ? 0 : motionTheme.duration.slow,
        ease: motionTheme.ease.inOut
      }}
    >
      Content
    </motion.div>
  );
}
```

**AnimatePresence with conditional rendering:**
```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: motionTheme.duration.normal }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

**Spring animations:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={motionTheme.spring.soft}
>
  Button
</motion.button>
```

---

## Responsive Design

### Breakpoints

Defined in `tailwind.config.ts`:

| Breakpoint | Min Width | Device | Usage |
|------------|-----------|--------|-------|
| `xs` | 320px | Small mobile | iPhone SE, Galaxy Fold |
| `sm` | 375px | Mobile | iPhone 12/13, most phones |
| `md` | 640px | Large mobile / Small tablet | iPhone Plus, large phones |
| `lg` | 768px | Tablet / Small desktop | iPad Mini, small tablets |
| `xl` | 1024px | Desktop | iPad Pro, laptops |
| `2xl` | 1280px | Large desktop | Desktop monitors |
| `3xl` | 1536px | Widescreen | Large monitors, 4K displays |

**Tailwind usage (mobile-first):**
```tsx
<div className="p-sm sm:p-md lg:p-xl">
  {/* 8px padding on mobile, 16px on sm+, 32px on lg+ */}
</div>
```

**styled-components usage:**
```tsx
const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  
  @media (min-width: 640px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  @media (min-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;
```

---

### Fluid Typography

Font sizes automatically scale between 320px and desktop using CSS `clamp()` functions.

**Implementation (in `src/styles/tailwind.css`):**
```css
@media (min-width: 320px) {
  :root {
    --font-size-xs: clamp(0.7rem, 0.6vw + 0.6rem, 0.75rem);
    --font-size-sm: clamp(0.8rem, 0.7vw + 0.7rem, 0.875rem);
    --font-size-base: clamp(0.9rem, 0.8vw + 0.8rem, 1rem);
    --font-size-lg: clamp(1rem, 0.9vw + 0.9rem, 1.125rem);
    --font-size-xl: clamp(1.1rem, 1vw + 1rem, 1.25rem);
    --font-size-2xl: clamp(1.25rem, 1.2vw + 1.1rem, 1.5rem);
    --font-size-3xl: clamp(1.5rem, 1.5vw + 1.2rem, 1.875rem);
  }
}
```

**Benefits:**
- Smooth scaling across all viewport sizes
- No breakpoint jumps for typography
- Better readability on all devices
- Automatic line height pairing

---

### Responsive Patterns

#### Layout Patterns

**Mobile-first stacking:**
```tsx
<div className="flex flex-col lg:flex-row gap-md">
  <aside className="w-full lg:w-64">Sidebar</aside>
  <main className="flex-1">Main content</main>
</div>
```

**Responsive grid:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

#### Component Patterns

**Hide on mobile, show on desktop:**
```tsx
<button className="hidden sm:inline-flex">
  Full Text Button
</button>
```

**Different content on mobile vs desktop:**
```tsx
<>
  <span className="sm:hidden">SM</span>
  <span className="hidden sm:inline">Small</span>
</>
```

**Responsive padding:**
```tsx
<div className="p-sm sm:p-md lg:p-xl 2xl:p-2xl">
  Content with scaling padding
</div>
```

---

## Accessibility Conventions

For comprehensive accessibility documentation, see [ACCESSIBILITY.md](../ACCESSIBILITY.md). This section covers design system-specific accessibility patterns.

### Focus Management

**Focus indicators (focus-visible):**

All interactive elements have high-contrast focus indicators that only appear for keyboard navigation:

```css
&:focus-visible {
  outline: 2px solid ${theme.colors.accent};
  outline-offset: 2px;
}

@media (prefers-contrast: more) {
  &:focus-visible {
    outline-width: 3px;
  }
}
```

**Tailwind equivalent:**
```tsx
<button className="focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2">
  Button
</button>
```

**Focus trapping in modals:**

See `components/ui/AccessibleModal.tsx` for implementation. The modal component:
- Traps focus within modal when open
- Restores focus to trigger element on close
- Supports Escape key to close
- Locks body scroll

---

### ARIA Patterns

#### Live Regions

**Status updates (polite):**
```tsx
<div role="status" aria-live="polite">
  Connected to room
</div>
```

**Error alerts (assertive):**
```tsx
<div role="alert" aria-live="assertive">
  Failed to send message
</div>
```

**New messages (additions):**
```tsx
<div aria-live="polite" aria-relevant="additions">
  {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
</div>
```

#### Modal Dialogs

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description</p>
</div>
```

#### Form Fields

```tsx
<div>
  <label htmlFor="username">Username</label>
  <input
    id="username"
    type="text"
    aria-describedby="username-hint username-error"
    aria-invalid={hasError}
  />
  <p id="username-hint">Choose a unique username</p>
  {hasError && (
    <p id="username-error" role="alert">
      Username is required
    </p>
  )}
</div>
```

---

### Touch Targets

All interactive elements meet **WCAG 2.1 Level AA** minimum touch target size of **44x44px**.

**Implementation:**
```tsx
const Button = styled.button`
  min-height: 44px;
  min-width: 44px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
`;
```

**Tailwind equivalent:**
```tsx
<button className="min-h-[44px] min-w-[44px] px-lg py-sm">
  Button
</button>
```

**Components with enforced touch targets:**
- All buttons (MessageInput, UtilityBar, EmptyState, modals)
- Theme toggle
- Room selector
- Display name button

---

### High Contrast Mode

The design system automatically enhances borders and outlines in high contrast mode:

```css
@media (prefers-contrast: more) {
  :root {
    --color-border: #000000;
  }
  
  [data-theme='dark'] {
    --color-border: #ffffff;
  }
  
  * {
    border-width: 2px !important;
  }
}
```

This ensures all UI elements remain visible and distinguishable for users with low vision or color blindness.

---

## Component Inventory

### Layout Components

**Location:** `components/layout/`

#### LayoutShell
- Main application wrapper with layered gradients
- Provides visual depth and structure
- Animated entrance with framer-motion

**File:** `components/layout/LayoutShell.tsx`

**Usage:**
```tsx
<LayoutShell>
  {/* App content */}
</LayoutShell>
```

#### UtilityBar
- Persistent utility bar with theme toggle, room selector, status indicators
- Responsive: collapses status text on mobile
- All buttons meet 44x44px touch target minimum

**File:** `components/layout/UtilityBar.tsx`

**Props:**
```tsx
interface UtilityBarProps {
  currentRoom: string | null;
  onRoomClick: () => void;
  isConnected: boolean;
  schemaRegistering: boolean;
}
```

#### ChatContainer
- Scrollable message area with custom scrollbar
- Fixed composer panel for message input
- Responsive padding and border radius

**File:** `components/layout/ChatContainer.tsx`

**Components:**
- `ChatContainer`: Main wrapper
- `ScrollableContent`: Message scroll area with `aria-live="polite"`
- `ComposerPanel`: Fixed input area

---

### UI Components

**Location:** `components/ui/`

**Exports:** See `components/ui/index.ts`

#### AccessibleModal
Base modal component with full accessibility support.

**File:** `components/ui/AccessibleModal.tsx`

**Features:**
- Focus trapping
- Escape key support
- Overlay click dismissal
- Body scroll locking
- Animated entrance/exit
- ARIA modal semantics

**Props:**
```tsx
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}
```

**Sizes:** Defined in `components/ui/modal.types.ts`
- `sm`: 28rem (448px)
- `md`: 32rem (512px)
- `lg`: 42rem (672px)
- `xl`: 56rem (896px)

#### Badge
Flexible badge component for metadata and status.

**File:** `components/ui/Badge.tsx`

**Variants:**
- `default`: Gray badge
- `primary`: Primary color
- `success`: Green success state
- `warning`: Amber warning state
- `error`: Red error state

**Usage:**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

#### CharacterCounter
Character counter with visual feedback.

**File:** `components/ui/CharacterCounter.tsx`

**Features:**
- Warning at 90% capacity (amber)
- Error at 100% capacity (red)
- Accessible with `aria-live="polite"`

**Props:**
```tsx
interface CharacterCounterProps {
  current: number;
  max: number;
}
```

#### SkeletonLoader
Animated skeleton loading placeholder.

**File:** `components/ui/SkeletonLoader.tsx`

**Features:**
- Shimmer animation (respects reduced motion)
- Configurable width, height, rounded corners
- Accessible with `aria-busy` and `aria-label`

**Props:**
```tsx
interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  rounded?: boolean;
}
```

#### ValidationFeedback
Inline validation with icons and messages.

**File:** `components/ui/ValidationFeedback.tsx`

**Types:**
- `success`: Green with checkmark icon
- `error`: Red with X icon

**Props:**
```tsx
interface ValidationFeedbackProps {
  type: 'success' | 'error';
  message: string;
}
```

---

### Shared Components

**Location:** `components/shared/`

#### EmptyState
Polished empty state with icon, title, description, and optional action.

**File:** `components/shared/EmptyState.tsx`

**Features:**
- Responsive layout
- Gradient background
- 44x44px action button
- Semantic heading hierarchy (h2)

**Props:**
```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

#### LoadingState
Animated loading state with spinner and message.

**File:** `components/shared/LoadingState.tsx`

**Features:**
- Three sizes: `sm`, `md`, `lg`
- Pulsing message text
- Respects reduced motion

**Props:**
```tsx
interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

---

### Feature Components

**Location:** `components/`

#### Header
Navigation header with wallet connection and user actions.

**File:** `components/Header.tsx`

**Features:**
- RainbowKit ConnectButton integration
- Room name display and button
- Display name button
- Responsive: hides buttons on mobile

#### ChatBubble
Individual message display with sender info and timestamp.

**File:** `components/ChatBubble.tsx`

**Features:**
- Self/other message styling
- Slide/fade entrance animation
- Responsive text sizing

**Props:**
```tsx
interface ChatBubbleProps {
  sender: string;
  text: string;
  timestamp: string;
  type: 'self' | 'other';
}
```

#### MessageInput
Message composition input with send button and typing indicator.

**File:** `components/MessageInput.tsx`

**Features:**
- Disabled state when not connected
- Character counter
- Loading state with shimmer
- Enter to send, Shift+Enter for newline
- Button press/release animations

**Props:**
```tsx
interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}
```

#### RoomModal
Create and join chat rooms.

**File:** `components/RoomModal.tsx`

**Features:**
- Tabbed interface (Join Room / Create Room)
- Skeleton loaders for loading states
- Inline validation with ValidationFeedback
- Character counter for room names
- Badge metadata (owner, last activity)
- Tab transition animations

**Tabs:**
- **Join Room**: Browse and join existing rooms
- **Create Room**: Create new room with name and schema ID

#### DisplayNameModal
Edit user display name (per wallet).

**File:** `components/DisplayNameModal.tsx`

**Features:**
- Contextual helper text
- Character counter (max 50 characters)
- Inline validation
- Improved button hierarchy

#### TypingIndicator
Animated typing indicator.

**File:** `components/TypingIndicator.tsx`

**Features:**
- Bounce animation (pulse fallback for reduced motion)
- Accessible with `aria-live="polite"`

**Props:**
```tsx
interface TypingIndicatorProps {
  users?: string[];
}
```

#### SkipToContent
Skip-to-content link for keyboard navigation.

**File:** `components/SkipToContent.tsx`

**Features:**
- Visually hidden until focused
- Links to `#main-content`
- High-contrast focus indicator

---

### Icon Components

**Location:** `components/icons/`

#### ThemeIcon
Animated theme toggle icon with sun/moon.

**File:** `components/icons/ThemeIcon.tsx`

**Features:**
- Integrated with `useThemeMode()` hook
- Animated icon transitions
- Accessible button with descriptive label

#### SendIcon
Send message icon for MessageInput.

**File:** `components/icons/SendIcon.tsx`

#### SpinnerIcon
Loading spinner icon.

**File:** `components/icons/SpinnerIcon.tsx`

**Features:**
- Smooth rotation animation
- Respects reduced motion
- Configurable size

---

## TypeScript Integration

### Exported Types and Interfaces

#### Theme Types

**Source:** `src/providers/ThemeProvider.tsx`

```tsx
export interface Theme {
  colors: { ... };
  typography: { ... };
  spacing: { ... };
  radius: { ... };
  shadows: { ... };
  zIndex: { ... };
}

export type ThemeMode = 'light' | 'dark';
```

**styled-components integration:** `src/styled.d.ts`

```tsx
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

#### Motion Types

**Source:** `src/config/motionTheme.ts`

```tsx
export type MotionTheme = typeof motionTheme;
```

#### Modal Types

**Source:** `components/ui/modal.types.ts`

```tsx
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}

export interface ValidationState {
  isValid: boolean;
  message?: string;
}

export type ModalSizeKey = 'sm' | 'md' | 'lg' | 'xl';
```

#### Component Props

Most components export their props interfaces for reuse and extension:

```tsx
// From ChatBubble.tsx
export interface ChatBubbleProps {
  sender: string;
  text: string;
  timestamp: string;
  type: 'self' | 'other';
}

// From EmptyState.tsx
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## Resources

### Internal Documentation
- [README.md](../README.md) - Project overview and setup
- [ACCESSIBILITY.md](../ACCESSIBILITY.md) - Accessibility features and testing
- [ENV_SETUP.md](../ENV_SETUP.md) - Environment configuration
- [REFACTOR_SUMMARY.md](../REFACTOR_SUMMARY.md) - Technical refactoring details

### Design Tokens
- `src/styles/tailwind.css` - CSS custom properties (source of truth)
- `tailwind.config.ts` - Tailwind configuration
- `src/providers/ThemeProvider.tsx` - Theme provider and context
- `src/config/motionTheme.ts` - Motion configuration

### External Resources
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [styled-components Documentation](https://styled-components.com/docs)
- [framer-motion Documentation](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Contributing to the Design System

When adding new design tokens or components:

1. **Add tokens to CSS custom properties** in `src/styles/tailwind.css` (both `:root` and `[data-theme='dark']`)
2. **Update Tailwind config** in `tailwind.config.ts` to expose tokens as utility classes
3. **Update Theme interface** in `src/providers/ThemeProvider.tsx` for styled-components support
4. **Document in this file** with usage examples and code snippets
5. **Add TypeScript types** for any new interfaces or props
6. **Write accessibility tests** using jest-axe
7. **Test responsiveness** at all breakpoints (320px - 1536px+)
8. **Verify reduced motion** support for any animations

Maintain consistency with existing patterns and always prioritize accessibility.

---

**Last Updated:** 2024  
**Version:** 1.0.0
