import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import { AppTheme } from "@/constants/theme";

const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.emphasized]}>Settings</Text>
    </View>
  );
};

export default SettingsScreen;

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
