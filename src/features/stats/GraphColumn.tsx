// FILE: src/features/stats/GraphColumn.tsx
// FILE: src/features/stats/GraphColumn.tsx
import { AppTheme } from "@/constants/theme";
import { useTheme } from "@/core/theme/ThemeContext";
import { format } from "date-fns";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";

// Define the shape of the pre-computed data
export type GraphColumnData = {
  date: Date;
  cells: {
    id: string;
    color: string;
  }[];
};

type GraphColumnProps = {
  data: GraphColumnData;
  cellSize: number;
  columnWidth: number;
};

const GraphColumnComponent = ({
  data,
  cellSize,
  columnWidth,
}: GraphColumnProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, cellSize);

  return (
    <View style={[styles.column, { width: columnWidth }]}>
      <ThemedText style={styles.dayText}>{format(data.date, "d")}</ThemedText>
      {data.cells.map((cell) => (
        <View
          key={cell.id}
          style={[styles.cell, { backgroundColor: cell.color }]}
        />
      ))}
    </View>
  );
};

export const GraphColumn = React.memo(GraphColumnComponent);

const getStyles = (theme: AppTheme, cellSize: number) =>
  StyleSheet.create({
    column: {
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 2,
    },
    dayText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      height: 16,
    },
    cell: {
      width: cellSize,
      height: cellSize,
      borderRadius: 4,
      marginBottom: 4,
    },
  });
