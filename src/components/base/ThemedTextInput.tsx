// src/components/base/ThemedTextInput.tsx
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export const ThemedTextInput = (props: TextInputProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { style, ...rest } = props;

  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={theme.colors.textSecondary}
      {...rest}
    />
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    input: {
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      padding: theme.spacing.m,
      borderRadius: 8,
      fontSize: theme.typography.fontSize.m,
      borderWidth: 1,
      borderColor: theme.colors.foreground,
    },
  });
