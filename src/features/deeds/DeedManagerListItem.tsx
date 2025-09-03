// src/features/deeds/DeedManagerListItem.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed } from "@/core/data/models";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { triggerHaptic } from "@/core/utils/haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";

type DeedManagerListItemProps = {
  deed: Deed;
  drag: () => void;
  isDragging: boolean;
};

export const DeedManagerListItem = ({
  deed,
  drag,
  isDragging,
}: DeedManagerListItemProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const deleteDeed = useAppStore((state) => state.deleteDeed);

  const isEditable = !deed.isCore;

  const handleEdit = () => {
    triggerHaptic();
    router.push({
      pathname: "/create-deed",
      params: { deedId: deed.id },
    });
  };

  const handleDelete = () => {
    triggerHaptic();
    const deedName = i18n.t(`deeds_names.${deed.id}`, {
      defaultValue: deed.name,
    });
    Alert.alert(
      i18n.t("alerts.deleteDeedTitle"),
      i18n.t("alerts.deleteDeedMessage", { deedName }),
      [
        { text: i18n.t("alerts.cancel"), style: "cancel" },
        {
          text: i18n.t("alerts.delete"),
          style: "destructive",
          onPress: () => deleteDeed(deed.id),
        },
      ],
    );
  };

  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        delayLongPress={150}
        activeOpacity={0.8}
        style={[styles.container, isDragging && styles.dragging]}
      >
        <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
          <MaterialCommunityIcons
            name="drag-horizontal-variant"
            size={28}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <MaterialCommunityIcons
          name={deed.icon}
          size={24}
          color={theme.colors.textSecondary}
          style={styles.icon}
        />
        <ThemedText style={styles.deedName}>
          {i18n.t(`deeds_names.${deed.id}`, { defaultValue: deed.name })}
        </ThemedText>

        {isEditable && (
          <Box style={styles.actionsContainer}>
            <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={22}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.actionButton}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color={theme.colors.late}
              />
            </TouchableOpacity>
          </Box>
        )}
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingEnd: theme.spacing.s,
      backgroundColor: theme.colors.foreground,
      borderRadius: 12,
      marginBottom: theme.spacing.s,
    },
    dragging: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dragHandle: {
      padding: theme.spacing.m,
    },
    icon: {
      marginEnd: theme.spacing.m,
    },
    deedName: {
      flex: 1,
    },
    actionsContainer: {
      flexDirection: "row",
    },
    actionButton: {
      padding: theme.spacing.s,
    },
  });
