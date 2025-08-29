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
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

const CreateDeedScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const params = useLocalSearchParams();
  const deedId = typeof params.deedId === "string" ? params.deedId : undefined;
  const isEditMode = !!deedId;

  const {
    draftDeed,
    initializeDraftDeed,
    updateDraftDeed,
    clearDraftDeed,
    saveDraftDeed,
  } = useAppStore();
  const allDeeds = useAppStore((state) => state.deeds);

  const [isIconModalVisible, setIconModalVisible] = useState(false);

  useEffect(() => {
    initializeDraftDeed(deedId);
    return () => {
      clearDraftDeed();
    };
  }, [initializeDraftDeed, deedId, clearDraftDeed]);

  const handleSave = () => {
    if (!draftDeed?.name?.trim()) {
      Alert.alert("Missing Name", "Please enter a name for your deed.");
      return;
    }
    saveDraftDeed();
    router.back();
  };

  const handleSelectIcon = (
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"],
  ) => {
    updateDraftDeed({ icon });
    setIconModalVisible(false);
  };

  const getFrequencyLabel = () => {
    if (!draftDeed?.frequency) return "Not set";
    if (draftDeed.frequency.type === "daily") return "Daily";
    if (draftDeed.frequency.type === "weekly") {
      const dayCount = draftDeed.frequency.days?.length || 0;
      return `Weekly (${dayCount} ${dayCount === 1 ? "day" : "days"})`;
    }
    return "Not set";
  };

  const getGoalLabel = () => {
    if (!draftDeed?.goal) return "Not set";
    return `${draftDeed.goal.value} ${draftDeed.goal.unit}`;
  };

  const getParentLabel = () => {
    if (!draftDeed?.parentId) return "None";
    const parent = allDeeds.find((d) => d.id === draftDeed.parentId);
    return parent?.name || "None";
  };

  if (!draftDeed) {
    return (
      <Screen title={isEditMode ? "Edit Deed" : "Create a Deed"}>
        <ActivityIndicator style={{ marginTop: 20 }} />
      </Screen>
    );
  }

  return (
    <>
      <Screen
        title={isEditMode ? "Edit Deed" : "Create a Deed"}
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
                name={draftDeed.icon}
                size={32}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <ThemedTextInput
              placeholder="Deed name (e.g. Read a book)"
              value={draftDeed.name}
              onChangeText={(name) => updateDraftDeed({ name })}
              style={styles.textInput}
            />
          </Box>
          <ThemedText style={styles.sectionHeader}>Configuration</ThemedText>
          <ConfigRow
            icon="calendar-sync"
            label="Frequency"
            value={getFrequencyLabel()}
            onPress={() => router.push("/configure-frequency")}
          />
          <ConfigRow
            icon="bullseye-arrow"
            label="Goal"
            value={getGoalLabel()}
            onPress={() => router.push("/configure-goal")}
          />
          <ConfigRow
            icon="file-tree"
            label="Parent Deed"
            value={getParentLabel()}
            onPress={() => router.push("/configure-parent")}
          />
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

// Helper component
const ConfigRow = ({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
  onPress?: () => void;
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity style={styles.configRow} onPress={onPress}>
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
    </TouchableOpacity>
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
      borderWidth: 1,
      borderColor: theme.colors.background,
    },
    iconPicker: {
      padding: theme.spacing.s,
      marginRight: theme.spacing.s,
    },
    textInput: {
      flex: 1,
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
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
