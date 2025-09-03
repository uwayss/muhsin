// src/features/stats/ActivityGraph.tsx
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedLog } from "@/core/data/models";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format, isSameDay } from "date-fns";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type ActivityGraphProps = {
  deeds: Deed[];
  logs: DeedLog[];
  dateRange: Date[];
};

export const ActivityGraph = ({
  deeds,
  logs,
  dateRange,
}: ActivityGraphProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.graphContainer}>
      <View style={styles.graphYAxis}>
        {deeds.map((deed) => (
          <MaterialCommunityIcons
            key={deed.id}
            name={deed.icon}
            size={20}
            color={theme.colors.textSecondary}
            style={styles.graphIcon}
          />
        ))}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.graphGrid}>
          {dateRange.map((date, index) => (
            <View key={date.toISOString()} style={styles.graphColumn}>
              {deeds.map((deed) => {
                const log = logs.find(
                  (l) =>
                    l.deedId === deed.id && isSameDay(new Date(l.date), date),
                );
                const status = log
                  ? deed.statuses.find((s) => s.id === log.statusId)
                  : null;
                const cellColor = status
                  ? theme.colors[status.color]
                  : theme.colors.background;
                return (
                  <View
                    key={deed.id}
                    style={[styles.graphCell, { backgroundColor: cellColor }]}
                  />
                );
              })}
              {/* Show day of the month every 7 days */}
              {index % 7 === 0 && (
                <ThemedText style={styles.dayLabel}>
                  {format(date, "d")}
                </ThemedText>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    graphContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.m,
    },
    graphYAxis: {
      justifyContent: "space-around",
      marginEnd: theme.spacing.s,
      paddingBottom: theme.spacing.l,
    },
    graphIcon: {
      height: 20,
    },
    graphGrid: {
      flexDirection: "row",
    },
    graphColumn: {
      justifyContent: "space-around",
      alignItems: "center",
      marginEnd: theme.spacing.xs,
    },
    graphCell: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.foreground,
      marginBottom: theme.spacing.xs,
    },
    dayLabel: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      position: "absolute",
      bottom: -theme.spacing.m,
    },
  });
