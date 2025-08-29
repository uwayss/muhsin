// src/components/base/ThemedText.tsx
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { Text, TextProps } from "react-native";

export const ThemedText = (props: TextProps) => {
  const { theme } = useTheme();
  const { style, ...rest } = props;

  return (
    <Text
      style={[
        {
          color: theme.colors.text, // Default color from the theme
          fontSize: theme.typography.fontSize.m,
        },
        style, // Allow incoming styles to override the defaults
      ]}
      {...rest}
    />
  );
};
