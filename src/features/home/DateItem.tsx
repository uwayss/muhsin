// src/features/home/DateItem.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import { format } from "date-fns";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export const ITEM_MARGIN = 8;

type DateItemProps = {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
  itemWidth: number;
};

const DateItemComponent = ({
  date,
  isSelected,
  isToday,
  onPress,
  itemWidth,
}: DateItemProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, isSelected, isToday);

  const dayName = format(date, "E");
  const dayNumber = format(date, "d");

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { width: itemWidth, marginRight: ITEM_MARGIN }]}
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
