// src/features/deeds/SuggestedDeedListItem.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed } from "@/core/data/models";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type SuggestedDeedListItemProps = {
  deed: Deed;
  isAdded: boolean;
  onPress: () => void;
};

export const SuggestedDeedListItem = ({
  deed,
  isAdded,
  onPress,
}: SuggestedDeedListItemProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <Box style={styles.container}>
      <MaterialCommunityIcons
        name={deed.icon}
        size={28}
        color={theme.colors.textSecondary}
      />
      <ThemedText style={styles.deedName}>{deed.name}</ThemedText>
      <TouchableOpacity
        onPress={onPress}
        disabled={isAdded}
        style={[styles.addButton, isAdded && styles.addedButton]}
      >
        <MaterialCommunityIcons
          name={isAdded ? "check" : "plus"}
          size={20}
          color={isAdded ? theme.colors.primary : theme.colors.primaryContrast}
        />
      </TouchableOpacity>
    </Box>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      marginBottom: theme.spacing.s,
    },
    deedName: {
      flex: 1,
      marginLeft: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
    },
    addButton: {
      padding: theme.spacing.s,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
    },
    addedButton: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
  });
