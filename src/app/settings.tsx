// src/app/settings.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import {
  getSettingsData,
  ModalSettingsItem,
  SettingsItem,
} from "@/features/settings/settingsData";
import { SettingsListItem } from "@/features/settings/SettingsListItem";
import { SettingsOptionModal } from "@/features/settings/SettingsOptionModal";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { SectionList, StyleSheet, View, Share, Alert } from "react-native";

const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const [modalData, setModalData] = useState<ModalSettingsItem<"theme"> | null>(
    null,
  );
  const resetData = useAppStore((state) => state.resetData);
  //TODO: modularize and abstract the actions
  const actions = useMemo(
    () => ({
      invite: async () => {
        try {
          await Share.share({
            message:
              "Check out Muhsin, a simple and private app for tracking your spiritual deeds. https://github.com/uwayss/muhsin",
          });
        } catch (error) {
          console.error("Failed to share:", error);
        }
      },
      rate: () => {
        const storeUrl = "market://details?id=com.uwayss.muhsin";
        Linking.openURL(storeUrl).catch((err) =>
          console.error("Couldn't load page", err),
        );
      },
      feedback: () => {
        Linking.openURL(
          "mailto:antar.muhammed1@gmail.com?subject=Muhsin Feedback",
        ).catch((err) => console.error("Couldn't open mail client", err));
      },
      reset: () => {
        Alert.alert(
          "Reset Everything?",
          "This will delete all your logged data and custom deeds. This action cannot be undone.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Reset",
              style: "destructive",
              onPress: () => resetData(),
            },
          ],
        );
      },
      privacy: () =>
        Linking.openURL(
          "https://github.com/uwayss/muhsin/blob/main/PRIVACY.md",
        ),
    }),
    [resetData],
  );

  const settingsData = useMemo(() => getSettingsData(actions), [actions]);
  const appVersion = Constants.expoConfig?.version ?? "N/A";

  const handleItemPress = (item: SettingsItem) => {
    if (item.type === "navigation") router.push(item.path);
    if (item.type === "modal") setModalData(item as ModalSettingsItem<"theme">);
    if (item.type === "action") item.action();
  };

  return (
    <Screen title="Settings">
      <SectionList
        sections={settingsData}
        keyExtractor={(item) => item.label}
        renderItem={({ item, section, index }) => (
          <SettingsListItem
            item={item}
            isFirst={index === 0}
            isLast={index === section.data.length - 1}
            onPress={handleItemPress}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              App version {appVersion}
            </ThemedText>
            <ThemedText style={styles.footerText}>
              Made with 🤍 in Istanbul
            </ThemedText>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <SettingsOptionModal
        modalData={modalData}
        onClose={() => setModalData(null)}
      />
    </Screen>
  );
};

export default SettingsScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    sectionTitle: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.s,
      marginLeft: theme.spacing.m,
    },
    listContent: {
      paddingHorizontal: theme.spacing.m,
      paddingBottom: theme.spacing.l,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.background,
      marginHorizontal: theme.spacing.m,
    },
    footer: {
      alignItems: "center",
      marginTop: theme.spacing.xl,
      paddingBottom: theme.spacing.l,
    },
    footerText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.s,
      marginBottom: theme.spacing.xs,
    },
  });
