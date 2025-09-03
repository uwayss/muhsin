// src/features/settings/DevMenuModal.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import React from "react";
import {
  Modal,
  StyleSheet,
  Switch,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type DevMenuModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const DevMenuModal = ({ isVisible, onClose }: DevMenuModalProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { toggleDemoMode } = useAppStore();
  const isDemoMode = useAppStore((state) => state.settings.isDemoMode);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <ThemedText style={styles.title}>
                {i18n.t("devMenu.title")}
              </ThemedText>
              <View style={styles.optionRow}>
                <ThemedText style={styles.optionLabel}>
                  {i18n.t("devMenu.enableDemo")}
                </ThemedText>
                <Switch
                  value={isDemoMode}
                  onValueChange={toggleDemoMode}
                  trackColor={{
                    false: theme.colors.background,
                    true: theme.colors.primary,
                  }}
                  thumbColor={theme.colors.foreground}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
      padding: theme.spacing.m,
    },
    title: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: theme.typography.fontWeight.semibold,
      textAlign: "center",
      marginBottom: theme.spacing.m,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.s,
    },
    optionLabel: {
      flex: 1,
      fontSize: theme.typography.fontSize.m,
      marginEnd: theme.spacing.m,
    },
  });
