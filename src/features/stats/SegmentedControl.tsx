// src/features/stats/SegmentedControl.tsx
import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import { ThemedText } from "@/components/base/ThemedText";
import { TimeInterval } from "./types";
import { TouchableOpacity } from "react-native-gesture-handler";

type Option = {
  label: string;
  value: TimeInterval;
};

type SegmentedControlProps = {
  options: Option[];
  selected: TimeInterval;
  onSelect: (interval: TimeInterval) => void;
};

export const SegmentedControl = ({
  options,
  selected,
  onSelect,
}: SegmentedControlProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { width } = useWindowDimensions();
  const internalPadding = 4;
  const containerWidth = width - theme.spacing.m * 2;
  const segmentWidth = (containerWidth - internalPadding * 2) / options.length;

  const selectedIndex = options.findIndex((opt) => opt.value === selected);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const targetTranslateX = selectedIndex * segmentWidth;
    return {
      transform: [
        {
          translateX: withSpring(targetTranslateX, {
            damping: 18,
            stiffness: 250,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.indicator,
          { width: segmentWidth },
          animatedIndicatorStyle,
        ]}
      />
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.segment, { width: segmentWidth }]}
          onPress={() => onSelect(opt.value)}
        >
          <ThemedText
            style={[
              styles.segmentText,
              selected === opt.value && styles.selectedText,
            ]}
          >
            {opt.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 4,
      height: 44,
      marginVertical: theme.spacing.m,
    },
    indicator: {
      position: "absolute",
      top: 4,
      left: 4,
      height: "100%",
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    segment: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    segmentText: {
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.s,
    },
    selectedText: {
      color: theme.colors.text,
    },
  });
