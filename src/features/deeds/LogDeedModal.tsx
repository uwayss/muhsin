// src/features/deeds/LogDeedModal.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedStatus } from "@/core/data/models";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

type LogDeedModalProps = {
  deed: Deed | null;
  isVisible: boolean;
  onClose: () => void;
  onLogStatus: (status: DeedStatus) => void;
};

export const LogDeedModal = ({
  deed,
  isVisible,
  onClose,
  onLogStatus,
}: LogDeedModalProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!deed) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <Box style={styles.header}>
            <MaterialCommunityIcons
              name={deed.icon}
              size={32}
              color={theme.colors.text}
            />
            <ThemedText style={styles.title}>
              How did you complete {deed.name} today?
            </ThemedText>
          </Box>
          <View>
            {deed.statuses.map((status) => (
              <TouchableOpacity
                key={status.id}
                style={styles.optionRow}
                onPress={() => onLogStatus(status)}
              >
                <MaterialCommunityIcons
                  name={status.icon}
                  size={24}
                  color={theme.colors[status.color]}
                />
                <ThemedText style={styles.optionLabel}>
                  {status.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      padding: theme.spacing.l,
    },
    container: {
      width: "100%",
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.l,
    },
    header: {
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
    title: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: theme.typography.fontWeight.semibold,
      textAlign: "center",
      marginTop: theme.spacing.m,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.m,
    },
    optionLabel: {
      marginLeft: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
    },
  });
