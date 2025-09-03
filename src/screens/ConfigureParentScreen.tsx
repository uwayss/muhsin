// FILE: src/screens/ConfigureParentScreen.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

const ConfigureParentScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Only use the user's active deeds
  const userDeeds = useAppStore((state) => state.deeds);
  const { draftDeed, updateDraftDeed } = useAppStore();

  const handleSelect = (deedId: string | null) => {
    updateDraftDeed({ parentId: deedId });
    navigation.goBack();
  };

  return (
    <Screen
      title={i18n.t("screens.configureParent")}
      renderLeftAction={() => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      )}
    >
      <FlatList
        data={userDeeds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.row,
              draftDeed?.parentId === item.id && styles.selectedRow,
            ]}
            onPress={() => handleSelect(item.id)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={theme.colors.textSecondary}
            />
            <ThemedText style={styles.deedName}>
              {i18n.t(`deeds_names.${item.id}`, { defaultValue: item.name })}
            </ThemedText>
            {draftDeed?.parentId === item.id && (
              <MaterialCommunityIcons
                name="check"
                size={24}
                color={theme.colors.primary}
              />
            )}
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <TouchableOpacity
            style={[styles.row, !draftDeed?.parentId && styles.selectedRow]}
            onPress={() => handleSelect(null)}
          >
            <MaterialCommunityIcons
              name="cancel"
              size={24}
              color={theme.colors.textSecondary}
            />
            <ThemedText style={styles.deedName}>
              {i18n.t("deeds.none")}
            </ThemedText>
            {!draftDeed?.parentId && (
              <MaterialCommunityIcons
                name="check"
                size={24}
                color={theme.colors.primary}
              />
            )}
          </TouchableOpacity>
        }
        contentContainerStyle={{ paddingTop: theme.spacing.m }}
      />
    </Screen>
  );
};
export default ConfigureParentScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      marginBottom: theme.spacing.s,
    },
    selectedRow: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    deedName: {
      flex: 1,
      marginStart: theme.spacing.m,
    },
  });
