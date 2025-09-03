// src/features/home/DateItem.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import { format, Locale } from "date-fns";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export const ITEM_MARGIN = 8;

type DateItemProps = {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
  itemWidth: number;
  locale: Locale;
};

const DateItemComponent = ({
  date,
  isSelected,
  isToday,
  onPress,
  itemWidth,
  locale,
}: DateItemProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, isSelected, isToday);

  const dayName = format(date, "E", { locale });
  const dayNumber = format(date, "d", { locale });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { width: itemWidth, marginEnd: ITEM_MARGIN }]}
    >
      <ThemedText style={styles.dayName}>{dayName}</ThemedText>
      <ThemedText style={styles.dayNumber}>{dayNumber}</ThemedText>
    </TouchableOpacity>
  );
};

export const DateItem = React.memo(DateItemComponent);

const getStyles = (theme: AppTheme, isSelected: boolean, isToday: boolean) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.s,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: isToday ? theme.colors.primary : "transparent",
      backgroundColor: isSelected
        ? theme.colors.primary
        : theme.colors.foreground,
    },
    dayName: {
      fontSize: theme.typography.fontSize.s,
      fontWeight: theme.typography.fontWeight.medium,
      color: isSelected
        ? theme.colors.primaryContrast
        : theme.colors.textSecondary,
    },
    dayNumber: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: theme.typography.fontWeight.bold,
      color: isSelected ? theme.colors.primaryContrast : theme.colors.text,
    },
  });
