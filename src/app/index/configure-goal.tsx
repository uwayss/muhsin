// src/app/index/configure-goal.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { ThemedTextInput } from "@/components/base/ThemedTextInput";
import { AppTheme } from "@/constants/theme";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const ConfigureGoalScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { draftDeed, updateDraftDeed } = useAppStore();
  const [value, setValue] = useState(draftDeed?.goal?.value?.toString() || "");
  const [unit, setUnit] = useState(draftDeed?.goal?.unit || "");

  const handleValueChange = (text: string) => {
    const num = parseInt(text, 10);
    setValue(text);
    if (!isNaN(num) && num > 0) {
      updateDraftDeed({ goal: { value: num, unit } });
    } else {
      updateDraftDeed({ goal: undefined });
    }
  };

  const handleUnitChange = (text: string) => {
    const numValue = parseInt(value, 10);
    setUnit(text);
    if (!isNaN(numValue) && numValue > 0 && text.trim()) {
      updateDraftDeed({ goal: { value: numValue, unit: text.trim() } });
    } else {
      updateDraftDeed({ goal: undefined });
    }
  };

  return (
    <Screen
      title="Set a Goal"
      renderLeftAction={() => (
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      )}
    >
      <View style={styles.container}>
        <ThemedText style={styles.label}>Target</ThemedText>
        <ThemedTextInput
          placeholder="e.g., 10"
          keyboardType="number-pad"
          value={value}
          onChangeText={handleValueChange}
        />
        <ThemedText style={styles.label}>Unit</ThemedText>
        <ThemedTextInput
          placeholder="e.g., Pages, Minutes"
          value={unit}
          onChangeText={handleUnitChange}
        />
      </View>
    </Screen>
  );
};
export default ConfigureGoalScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { paddingTop: theme.spacing.m },
    label: {
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      fontWeight: theme.typography.fontWeight.bold,
      marginBottom: theme.spacing.s,
      marginTop: theme.spacing.m,
    },
  });
