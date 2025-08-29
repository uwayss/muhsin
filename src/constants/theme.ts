// src/constants/theme.ts

import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

export const theme = {
  colors,
  spacing,
  typography,
};

// --- TypeScript Types --- //

// This is the corrected line.
// It creates a union type of all themes defined in `colors` (e.g., light | dark).
export type ColorTheme = (typeof colors)[keyof typeof colors];

// Full AppTheme type
export type AppTheme = {
  colors: ColorTheme;
  spacing: typeof spacing;
  typography: typeof typography;
};
