// src/features/deeds/ChildDeedLogItem.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedLog, DeedStatus } from "@/core/data/models";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { triggerHaptic } from "@/core/utils/haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type ChildDeedLogItemProps = {
  deed: Deed;
  log: DeedLog | undefined;
  date: Date;
};

export const ChildDeedLogItem = ({
  deed,
  log,
  date,
}: ChildDeedLogItemProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const addOrUpdateLog = useAppStore((state) => state.addOrUpdateLog);

  const handleLogStatus = (status: DeedStatus) => {
    triggerHaptic();
    addOrUpdateLog(deed, date, status);
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={deed.icon}
        size={24}
        color={theme.colors.textSecondary}
      />
      <ThemedText style={styles.deedName}>
        {i18n.t(`deeds_names.${deed.id}`, { defaultValue: deed.name })}
      </ThemedText>
      <Box style={styles.actionsContainer}>
        {deed.statuses.map((status) => {
          const isSelected = log?.statusId === status.id;
          return (
            <TouchableOpacity
              key={status.id}
              style={[
                styles.statusButton,
                { borderColor: theme.colors[status.color] },
                isSelected && { backgroundColor: theme.colors[status.color] },
              ]}
              onPress={() => handleLogStatus(status)}
            >
              <MaterialCommunityIcons
                name={status.icon}
                size={20}
                color={
                  isSelected
                    ? theme.colors.primaryContrast
                    : theme.colors[status.color]
                }
              />
            </TouchableOpacity>
          );
        })}
      </Box>
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.s,
    },
    deedName: {
      flex: 1,
      marginStart: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
    },
    actionsContainer: {
      flexDirection: "row",
    },
    statusButton: {
      padding: theme.spacing.s,
      borderRadius: 20,
      borderWidth: 1.5,
      marginLeft: theme.spacing.s,
    },
  });
