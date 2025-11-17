# Accessibility Guide

This document outlines the accessibility features, testing workflows, and best practices implemented in the Somnia On-Chain Chat application.

## Table of Contents

- [Overview](#overview)
- [WCAG 2.1 AA Compliance](#wcag-21-aa-compliance)
- [Accessibility Features](#accessibility-features)
- [Testing Workflow](#testing-workflow)
- [Responsive Design](#responsive-design)
- [Best Practices](#best-practices)

## Overview

This application is built with accessibility as a core principle, targeting **WCAG 2.1 Level AA** compliance. We ensure that all users, including those using assistive technologies, can effectively use the chat application.

## WCAG 2.1 AA Compliance

### Perceivable

- **Text Alternatives**: All non-text content has text alternatives via `aria-label` attributes
- **Color Contrast**: Color combinations meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Responsive Design**: Content is accessible from 320px mobile to widescreen displays
- **High Contrast Mode**: Application supports `prefers-contrast: more` media query with enhanced borders and outlines

### Operable

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: High-contrast focus outlines (2px solid, with 3px in high-contrast mode)
- **Skip to Content**: Skip link at the top of every page allows keyboard users to bypass navigation
- **Touch Targets**: All interactive elements meet minimum 44x44px touch target size on mobile
- **Motion**: Animations respect `prefers-reduced-motion` user preference

### Understandable

- **Semantic HTML**: Proper use of landmark regions (header, nav, main)
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Error Messages**: Clear, accessible error messages with `role="alert"` and `aria-live="assertive"`
- **Form Validation**: Inline validation with `aria-invalid` and `aria-describedby`

### Robust

- **Valid HTML**: Semantically correct markup
- **ARIA**: Proper ARIA roles, states, and properties
- **Browser Compatibility**: Works across modern browsers and assistive technologies

## Accessibility Features

### Skip to Content Link

A skip-to-content link is provided at the top of each page:

```tsx
<SkipToContent />
```

This link is visually hidden until focused, allowing keyboard users to skip directly to the main content area.

### Landmark Regions

All pages include proper landmark regions:

- `<header role="banner">` - Site header with navigation
- `<nav aria-label="...">` - Navigation sections with descriptive labels
- `<main id="main-content">` - Main content area (target of skip link)

### ARIA Live Regions

Dynamic content updates are announced to screen readers:

- **Status Updates**: Connection status uses `aria-live="polite"` and `role="status"`
- **New Messages**: Message container uses `aria-live="polite"` with `aria-relevant="additions"`
- **Errors**: Error alerts use `aria-live="assertive"` and `role="alert"`

### Focus Management

- All interactive elements have visible focus indicators
- Focus is properly managed in modals (trapped within modal when open)
- Focus is restored to trigger element when modal closes

### Form Accessibility

All forms include:
- Proper `<label>` elements or `aria-label` attributes
- `aria-describedby` for helper text and error messages
- `aria-invalid` for validation states
- Character counters with visual feedback
- Inline validation messages

### Motion Preferences

All animations respect the `prefers-reduced-motion` user preference:

```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
>
```

## Testing Workflow

### Automated Accessibility Testing

We use **jest-axe** for automated accessibility testing. Tests are integrated into our Vitest suite.

#### Running Accessibility Tests

```bash
# Run all tests (includes accessibility tests)
npm test

# Run only accessibility tests
npm test -- a11y.test

# Run tests in watch mode
npm run test:watch
```

#### Writing Accessibility Tests

Import jest-axe in your test file:

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from './test-utils';

expect.extend(toHaveNoViolations);

describe('Component Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<YourComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Testing Checklist

#### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Ensure focus indicators are visible
- [ ] Test skip-to-content link (Tab on page load)
- [ ] Verify modal focus trapping
- [ ] Test Escape key to close modals
- [ ] Test Enter/Space to activate buttons

#### Screen Reader Testing

Test with:
- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS/iOS)
- **TalkBack** (Android)

Checklist:
- [ ] All interactive elements are announced correctly
- [ ] ARIA labels provide clear descriptions
- [ ] Status updates are announced
- [ ] Form errors are announced
- [ ] New messages are announced
- [ ] Modal dialog is announced correctly

#### Visual Testing

- [ ] Test with 200% browser zoom
- [ ] Enable high contrast mode
- [ ] Test with dark and light themes
- [ ] Verify color contrast ratios
- [ ] Check focus indicators are visible

#### Mobile Testing

- [ ] Touch targets are at least 44x44px
- [ ] All features accessible via touch
- [ ] Content is readable at 320px width
- [ ] No horizontal scrolling

### Browser DevTools

#### Lighthouse Audit

Run Lighthouse in Chrome DevTools:

1. Open DevTools (F12)
2. Navigate to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Generate report"

Target: **Score of 90+**

#### Accessibility Insights

Use [Accessibility Insights for Web](https://accessibilityinsights.io/):

1. Install browser extension
2. Run "FastPass" for quick WCAG checks
3. Run "Assessment" for comprehensive evaluation

## Responsive Design

### Breakpoints

The application supports the following breakpoints:

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `xs` | 320px | Small mobile |
| `sm` | 375px | Mobile |
| `md` | 640px | Large mobile/Small tablet |
| `lg` | 768px | Tablet/Small desktop |
| `xl` | 1024px | Desktop |
| `2xl` | 1280px | Large desktop |
| `3xl` | 1536px | Widescreen |

### Responsive Testing

#### Test at Key Breakpoints

```tsx
describe('Responsive Tests', () => {
  const setViewport = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  it('should render correctly at 320px', () => {
    setViewport(320, 568);
    render(<YourComponent />);
    // Test mobile layout
  });
});
```

#### Manual Responsive Testing

1. Use Chrome DevTools Device Mode
2. Test at each breakpoint
3. Verify no horizontal scrolling
4. Check touch target sizes
5. Verify responsive typography

## Best Practices

### Writing Accessible Components

#### Use Semantic HTML

```tsx
// Good
<button onClick={handleClick}>Click me</button>

// Bad
<div onClick={handleClick}>Click me</div>
```

#### Provide Text Alternatives

```tsx
// Good
<button aria-label="Close modal">
  <svg aria-hidden="true">...</svg>
</button>

// Bad
<button>
  <svg>...</svg>
</button>
```

#### Use ARIA Correctly

```tsx
// Good
<div role="status" aria-live="polite">
  {statusMessage}
</div>

// Overuse of ARIA (prefer semantic HTML)
<div role="button" onClick={...}>Click</div>
```

#### Ensure Keyboard Support

```tsx
function MenuItem({ onClick }) {
  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      Menu Item
    </div>
  );
}
```

#### Focus Management

```tsx
function Modal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element
      const firstFocusable = modalRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      (firstFocusable as HTMLElement)?.focus();
    }
  }, [isOpen]);
  
  return <div ref={modalRef} role="dialog" aria-modal="true">...</div>;
}
```

### Color Contrast

Ensure all text meets WCAG AA standards:
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt): 3.1 contrast ratio
- UI components: 3:1 contrast ratio

Use tools like:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Colors](https://accessible-colors.com/)

### Testing Resources

- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Continuous Integration

Accessibility tests run automatically on every commit and pull request. Ensure all tests pass before merging:

```bash
npm test
```

If accessibility violations are detected, fix them before committing. Our CI pipeline will fail if:
- Jest-axe tests detect violations
- Accessibility score drops below threshold
- Manual accessibility checks are not completed

## Support

For questions or issues related to accessibility, please:
1. Check this documentation
2. Review existing accessibility tests
3. Consult the WCAG 2.1 guidelines
4. Open an issue with the `accessibility` label

## Version History

- **v1.0.0** - Initial accessibility implementation with WCAG 2.1 AA compliance
