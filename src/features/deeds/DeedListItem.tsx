// src/features/deeds/DeedListItem.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedLog } from "@/core/data/models";
import i18n from "@/core/i18n";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type DeedListItemProps = {
  deed: Deed;
  log: DeedLog | undefined; // The log for the selected date, if it exists
  onPress: () => void;
};

export const DeedListItem = ({ deed, log, onPress }: DeedListItemProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Find the full status object from the log's statusId
  const status = log ? deed.statuses.find((s) => s.id === log.statusId) : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box style={styles.container}>
        <MaterialCommunityIcons
          name={deed.icon}
          size={28}
          color={theme.colors.textSecondary}
        />
        <ThemedText style={styles.deedName}>
          {i18n.t(`deeds_names.${deed.id}`, { defaultValue: deed.name })}
        </ThemedText>

        {status && (
          <Box
            style={[
              styles.statusBadge,
              { backgroundColor: theme.colors[status.color] },
            ]}
          >
            <MaterialCommunityIcons
              name={status.icon}
              size={16}
              color={theme.colors.primaryContrast}
            />
          </Box>
        )}
      </Box>
    </TouchableOpacity>
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
      marginStart: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
      textAlign: "left", // Keep text aligned to the start of the text container
    },
    statusBadge: {
      padding: theme.spacing.xs,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
  });
