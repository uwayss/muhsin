// src/app/index/add-deed.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed } from "@/core/data/models";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { SuggestedDeedListItem } from "@/features/deeds/SuggestedDeedListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { SectionList, StyleSheet, TouchableOpacity } from "react-native";

const AddDeedScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // --- Global State ---
  const userDeeds = useAppStore((state) => state.deeds);
  const suggestedDeeds = useAppStore((state) => state.suggestedDeeds);
  const addDeed = useAppStore((state) => state.addDeed);

  const userDeedIds = useMemo(
    () => new Set(userDeeds.map((d) => d.id)),
    [userDeeds],
  );

  const suggestedDeedsBySection = useMemo(() => {
    const sections: { title: string; data: Deed[] }[] = [];
    const deedsByCategory = suggestedDeeds.reduce(
      (acc, deed) => {
        (acc[deed.category] = acc[deed.category] || []).push(deed);
        return acc;
      },
      {} as Record<string, Deed[]>,
    );

    for (const [category, deedsInSection] of Object.entries(deedsByCategory)) {
      sections.push({
        title: i18n.t(`categories.${category}`, { defaultValue: category }),
        data: deedsInSection,
      });
    }
    return sections;
  }, [suggestedDeeds]);

  return (
    <Screen
      title={i18n.t("screens.addDeed")}
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
      <SectionList
        sections={suggestedDeedsBySection}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <ThemedText style={styles.categoryTitle}>{title}</ThemedText>
        )}
        renderItem={({ item: deed }) => (
          <SuggestedDeedListItem
            deed={deed}
            isAdded={userDeedIds.has(deed.id)}
            onPress={() => addDeed(deed)}
          />
        )}
        ListHeaderComponent={
          <Link href="/create-deed" asChild>
            <TouchableOpacity style={styles.createDeedButton}>
              <MaterialCommunityIcons
                name="plus-circle"
                size={24}
                color={theme.colors.primary}
              />
              <ThemedText style={styles.createDeedText}>
                {i18n.t("deeds.createDeedButton")}
              </ThemedText>
            </TouchableOpacity>
          </Link>
        }
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
};

export default AddDeedScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    categoryTitle: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: theme.spacing.s,
      marginTop: theme.spacing.l,
    },
    listContent: {
      paddingBottom: theme.spacing.l,
      paddingTop: theme.spacing.s,
    },
    createDeedButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      marginBottom: theme.spacing.s,
    },
    createDeedText: {
      marginLeft: theme.spacing.m,
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  });
