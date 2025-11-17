import 'styled-components';
import type { Theme } from './providers/ThemeProvider';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
