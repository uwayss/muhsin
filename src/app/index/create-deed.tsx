// src/app/index/create-deed.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { ThemedTextInput } from "@/components/base/ThemedTextInput";
import { Screen } from "@/components/Screen";
import { AppTheme } from "@/constants/theme";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { IconSelectorModal } from "@/features/deeds/IconSelectorModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const CreateDeedScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const createCustomDeed = useAppStore((state) => state.createCustomDeed);

  const [deedName, setDeedName] = useState("");
  const [selectedIcon, setSelectedIcon] =
    useState<React.ComponentProps<typeof MaterialCommunityIcons>["name"]>(
      "star-outline",
    );
  const [isIconModalVisible, setIconModalVisible] = useState(false);

  const handleSave = () => {
    if (!deedName.trim()) {
      Alert.alert("Missing Name", "Please enter a name for your deed.");
      return;
    }
    createCustomDeed({ name: deedName.trim(), icon: selectedIcon });
    router.back();
  };

  const handleSelectIcon = (
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"],
  ) => {
    setSelectedIcon(icon);
    setIconModalVisible(false);
  };

  return (
    <>
      <Screen
        title="Create a Deed"
        renderLeftAction={() => (
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
        renderRightAction={() => (
          <TouchableOpacity onPress={handleSave}>
            <ThemedText style={styles.saveText}>Save</ThemedText>
          </TouchableOpacity>
        )}
      >
        <View style={styles.formContainer}>
          <Box style={styles.inputRow}>
            <TouchableOpacity
              style={styles.iconPicker}
              onPress={() => setIconModalVisible(true)}
            >
              <MaterialCommunityIcons
                name={selectedIcon}
                size={32}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <ThemedTextInput
              placeholder="Deed name (e.g. Read a book)"
              value={deedName}
              onChangeText={setDeedName}
              style={styles.textInput}
            />
          </Box>
          <ThemedText style={styles.sectionHeader}>
            Configuration (coming soon)
          </ThemedText>
          {/* These are placeholders as per the spec */}
          <ConfigRow icon="calendar-sync" label="Frequency" value="Daily" />
          <ConfigRow icon="bullseye-arrow" label="Goal" value="Not set" />
          <ConfigRow icon="file-tree" label="Parent Deed" value="None" />
        </View>
      </Screen>
      <IconSelectorModal
        isVisible={isIconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelectIcon={handleSelectIcon}
      />
    </>
  );
};

// Helper component for placeholder rows
const ConfigRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <TouchableWithoutFeedback disabled>
      <View style={styles.configRow}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={theme.colors.textSecondary}
        />
        <ThemedText style={styles.configLabel}>{label}</ThemedText>
        <ThemedText style={styles.configValue}>{value}</ThemedText>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.textSecondary}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    saveText: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
      fontSize: theme.typography.fontSize.m,
    },
    formContainer: {
      paddingTop: theme.spacing.m,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      padding: theme.spacing.s,
    },
    iconPicker: {
      padding: theme.spacing.s,
      marginRight: theme.spacing.s,
    },
    textInput: {
      flex: 1,
      backgroundColor: theme.colors.foreground, // Override default background
      borderWidth: 0,
    },
    sectionHeader: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.s,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.s,
    },
    configRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      marginBottom: theme.spacing.s,
      opacity: 0.5, // To indicate they are disabled
    },
    configLabel: {
      flex: 1,
      marginLeft: theme.spacing.m,
    },
    configValue: {
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.xs,
    },
  });
export default CreateDeedScreen;
