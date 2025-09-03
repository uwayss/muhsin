// src/features/settings/SettingsOptionModal.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import useAppStore, { AppSettings } from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { triggerHaptic } from "@/core/utils/haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ModalSettingsItem } from "./settingsData";

type SettingsOptionModalProps = {
  modalData: ModalSettingsItem<keyof AppSettings> | null;
  onClose: () => void;
};

export const SettingsOptionModal = ({
  modalData,
  onClose,
}: SettingsOptionModalProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { settings, setTheme, setLanguage } = useAppStore();

  if (!modalData) return null;

  const currentValue = settings[modalData.stateKey];

  const handleSelect = (value: any) => {
    triggerHaptic();
    onClose();
    setTimeout(() => {
      if (modalData.stateKey === "theme") {
        setTheme(value);
      } else if (modalData.stateKey === "language") {
        setLanguage(value);
      }
    }, 250);
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={!!modalData}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <ThemedText style={styles.title}>{modalData.title}</ThemedText>
              {modalData.options.map((option) => (
                <TouchableOpacity
                  key={option.value.toString()}
                  style={styles.optionRow}
                  onPress={() => handleSelect(option.value)}
                >
                  <ThemedText style={styles.optionLabel}>
                    {option.label}
                  </ThemedText>
                  {currentValue === option.value && (
                    <MaterialCommunityIcons
                      name="check"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
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
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.s,
    },
    optionLabel: {
      flex: 1,
      fontSize: theme.typography.fontSize.m,
    },
  });
