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
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
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
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* This View prevents the close event from firing when tapping the container */}
          <TouchableWithoutFeedback>
            <View style={styles.container}>
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
      padding: PADDING,
    },
    container: {
      width: "100%",
      height: "80%", // Use height instead of maxHeight
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
