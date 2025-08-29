// src/constants/colors.ts

const palette = {
  // Grays
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564F4A",
  neutral700: "#3C3835",
  neutral800: "#2B2724",
  neutral900: "#1C1917",

  // Primary (Example: A muted green)
  primary100: "#E3F9E5",
  primary200: "#C1EAC5",
  primary300: "#A3D9A5",
  primary400: "#85C78A",
  primary500: "#67B56F",
  primary600: "#4F8B55",

  // Accents for statuses
  accentRed: "#D9534F",
  accentYellow: "#F0AD4E",
  accentGreen: "#5CB85C",
} as const;

export const colors = {
  light: {
    background: palette.neutral200,
    foreground: palette.neutral100, // For cards, etc.
    text: palette.neutral900,
    textSecondary: palette.neutral600,
    primary: palette.primary500,
    primaryContrast: palette.neutral100,

    // Deed Status
    jamaah: palette.accentGreen,
    onTime: palette.accentYellow,
    late: palette.accentRed,
    missed: palette.neutral800,
  },
  dark: {
    background: palette.neutral900,
    foreground: palette.neutral800, // For cards, etc.
    text: palette.neutral100,
    textSecondary: palette.neutral400,
    primary: palette.primary500,
    primaryContrast: palette.neutral100,

    // Deed Status
    jamaah: palette.accentGreen,
    onTime: palette.accentYellow,
    late: palette.accentRed,
    missed: palette.neutral600,
  },
};
