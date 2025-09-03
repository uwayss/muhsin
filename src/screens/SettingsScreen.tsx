// FILE: src/screens/SettingsScreen.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
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
import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  I18nManager,
  Pressable,
  SectionList,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { SettingsStackParamList } from "@/navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  "SettingsMain"
>;

const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [modalData, setModalData] = useState<ModalSettingsItem<any> | null>(
    null,
  );
  const { resetData, setDevMode } = useAppStore();
  const isDevMode = useAppStore((state) => state.settings.isDevMode);
  const language = useAppStore((state) => state.settings.language);

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
        i18n.t("alerts.devModeTitle"),
        i18n.t("alerts.devModeMessage"),
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
            message: i18n.t("settings.shareMessage"),
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
        const subject = i18n.t("settings.feedbackSubject");
        const mailtoUrl = `mailto:support@uwayss.com?subject=${encodeURIComponent(
          subject,
        )}`;
        Linking.openURL(mailtoUrl).catch((err) =>
          console.error("Couldn't open mail client", err),
        );
      },
      reset: () => {
        Alert.alert(
          i18n.t("alerts.resetTitle"),
          i18n.t("alerts.resetMessage"),
          [
            {
              text: i18n.t("alerts.cancel"),
              style: "cancel",
            },
            {
              text: i18n.t("alerts.reset"),
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

  const settingsData = useMemo(
    () => getSettingsData(actions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actions, language],
  );
  const appVersion = Constants.expoConfig?.version ?? "N/A";

  const handleItemPress = (item: SettingsItem) => {
    if (item.type === "navigation") {
      navigation.navigate(item.path as any);
    } else if (item.type === "modal") {
      setModalData(item as ModalSettingsItem<any>);
    } else if (item.type === "action") {
      item.action();
    }
  };

  return (
    <>
      <Screen title={i18n.t("tabs.settings")}>
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
            <Pressable
              onPress={handleVersionTap}
              onLongPress={handleVersionLongPress}
            >
              <View style={styles.footer}>
                <ThemedText style={styles.footerText}>
                  {i18n.t("footer.appVersion", { version: appVersion })}
                  {isDevMode && i18n.t("footer.devMode")}
                </ThemedText>
                <ThemedText style={styles.footerText}>
                  {i18n.t("footer.madeWith")}
                </ThemedText>
              </View>
            </Pressable>
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
      marginTop: theme.spacing.m + 4,
      marginBottom: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      textAlign: I18nManager.isRTL ? "right" : "left",
    },
    listContent: {
      paddingBottom: theme.spacing.l,
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.background,
      marginStart: theme.spacing.m,
    },
    footer: {
      alignItems: "center",
      marginTop: theme.spacing.l,
    },
    footerText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.s,
      marginBottom: theme.spacing.xs,
    },
  });
