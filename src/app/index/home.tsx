// src/app/index/home.tsx
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
  const { theme } = useTheme();
  // Pass the theme to a style factory function
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to </Text>
      <Text style={[styles.text, styles.emphasized]}>Muhsin</Text>
      <Text style={styles.text}>!</Text>
    </View>
  );
};

export default HomeScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: theme.colors.background,
    },
    text: {
      fontSize: theme.typography.fontSize.l,
      color: theme.colors.text,
      fontWeight: theme.typography.fontWeight.light,
    },
    emphasized: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });
