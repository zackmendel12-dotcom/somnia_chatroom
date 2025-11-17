import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../../src/providers/ThemeProvider';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
