// src/features/deeds/IconSelectorModal.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { customDeedIcons } from "@/constants/icons";
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

type IconSelectorModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelectIcon: (
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"],
  ) => void;
};

const ICON_SIZE = 40;
const PADDING = 16;

export const IconSelectorModal = ({
  isVisible,
  onClose,
  onSelectIcon,
}: IconSelectorModalProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();

  const numColumns = Math.floor((width - PADDING * 2) / (ICON_SIZE + PADDING));

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
          <ThemedText style={styles.title}>Choose an Icon</ThemedText>
          <FlatList
            data={customDeedIcons}
            keyExtractor={(item) => item}
            numColumns={numColumns}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onSelectIcon(item)}
              >
                <MaterialCommunityIcons
                  name={item}
                  size={ICON_SIZE}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.grid}
          />
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
      padding: PADDING,
    },
    container: {
      width: "100%",
      maxHeight: "80%",
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: PADDING,
    },
    title: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: theme.typography.fontWeight.semibold,
      textAlign: "center",
      marginBottom: theme.spacing.m,
    },
    grid: {
      justifyContent: "center",
    },
    iconButton: {
      padding: theme.spacing.s,
      borderRadius: 8,
      margin: (PADDING - 8) / 2,
    },
  });
