// src/app/settings/index.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { DevMenuModal } from "@/features/settings/DevMenuModal";
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
import {
  Alert,
  Pressable,
  SectionList,
  Share,
  StyleSheet,
  View,
} from "react-native";

const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const [modalData, setModalData] = useState<ModalSettingsItem<any> | null>(
    null,
  );
  const { resetData, setDevMode } = useAppStore();
  const isDevMode = useAppStore((state) => state.settings.isDevMode);

  // --- Dev Mode State ---
  const [versionTapCount, setVersionTapCount] = useState(0);
  const [isDevMenuVisible, setDevMenuVisible] = useState(false);

  const handleVersionTap = () => {
    if (isDevMode) return;
    const newCount = versionTapCount + 1;
    setVersionTapCount(newCount);
    if (newCount >= 7) {
      setDevMode(true);
      Alert.alert(
        "Developer Mode Unlocked",
        "You can now long-press the version number to access developer options.",
      );
    }
  };

  const handleVersionLongPress = () => {
    if (isDevMode) {
      setDevMenuVisible(true);
    }
  };

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
          "mailto:support@uwayss.com?subject=Muhsin Feedback",
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
    if (item.type === "navigation") {
      router.push(item.path as any);
    } else if (item.type === "modal") {
      setModalData(item as ModalSettingsItem<any>);
    } else if (item.type === "action") {
      item.action();
    }
  };

  return (
    <>
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
          renderSectionHeader={({ section: { title } }) =>
            title ? (
              <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
            ) : null
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            <View style={styles.footer}>
              <Pressable
                onPress={handleVersionTap}
                onLongPress={handleVersionLongPress}
              >
                <ThemedText style={styles.footerText}>
                  App version {appVersion} {isDevMode && "(Dev)"}
                </ThemedText>
              </Pressable>
              <ThemedText style={styles.footerText}>
                Made with 🤍 in Istanbul
              </ThemedText>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Screen>

      <SettingsOptionModal
        modalData={modalData}
        onClose={() => setModalData(null)}
      />
      <DevMenuModal
        isVisible={isDevMenuVisible}
        onClose={() => setDevMenuVisible(false)}
      />
    </>
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
    },
    listContent: {
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
