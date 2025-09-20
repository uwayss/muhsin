// src/features/stats/ExpandableSection.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ExpandableSectionProps = {
  title: string;
  children: React.ReactNode;
};

export const ExpandableSection = ({
  title,
  children,
}: ExpandableSectionProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isExpanded, setIsExpanded] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);

  const animatedHeight = useSharedValue(0);
  const animatedRotation = useSharedValue(0);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
    animatedHeight.value = withTiming(isExpanded ? 0 : contentHeight, {
      duration: 300,
    });
    animatedRotation.value = withTiming(isExpanded ? -90 : 0, {
      duration: 300,
    });
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && height !== contentHeight) {
      setContentHeight(height);
      if (isExpanded) {
        animatedHeight.value = height;
      }
    }
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${animatedRotation.value}deg` }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpansion}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <Animated.View style={animatedIconStyle}>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={theme.colors.textSecondary}
          />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.contentContainer, animatedContainerStyle]}>
        <View style={styles.content} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.m,
    },
    title: {
      fontWeight: theme.typography.fontWeight.semibold,
    },
    contentContainer: {
      overflow: "hidden",
    },
    content: {
      position: "absolute",
      width: "100%",
      padding: theme.spacing.m,
      paddingTop: 0,
    },
  });
