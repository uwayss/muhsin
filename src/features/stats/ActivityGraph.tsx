// FILE: src/features/stats/ActivityGraph.tsx
import { AppTheme } from "@/constants/theme";
import { Deed, DeedLog } from "@/core/data/models";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatISO } from "date-fns";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { FlatList, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { GraphColumn, GraphColumnData } from "./GraphColumn";

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
  const [containerWidth, setContainerWidth] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Pre-compute all data and colors for the graph.
  // This is the core optimization.
  const graphColumnsData = useMemo<GraphColumnData[]>(() => {
    const logsByDate = new Map<string, DeedLog[]>();
    for (const log of logs) {
      const dateKey = log.date;
      if (!logsByDate.has(dateKey)) {
        logsByDate.set(dateKey, []);
      }
      logsByDate.get(dateKey)!.push(log);
    }

    return dateRange.map((date) => {
      const dateString = formatISO(date, { representation: "date" });
      const dailyLogs = logsByDate.get(dateString) || [];

      const cells = deeds.map((deed) => {
        const log = dailyLogs.find((l) => l.deedId === deed.id);
        const status = log
          ? deed.statuses.find((s) => s.id === log.statusId)
          : null;
        const cellColor = status
          ? theme.colors[status.color]
          : theme.colors.background;
        return {
          id: deed.id,
          color: cellColor,
        };
      });

      return { date, cells };
    });
  }, [logs, dateRange, deeds, theme]);

  const onLayout = (event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;
    if (newWidth > 0 && newWidth !== containerWidth) {
      setContainerWidth(newWidth);
    }
  };

  useEffect(() => {
    if (containerWidth > 0) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: false }),
        0,
      );
    }
  }, [containerWidth]);

  const yAxisWidth = 24;
  const daysToShow = 10;

  const availableGridWidth =
    containerWidth - yAxisWidth - theme.spacing.s - theme.spacing.m;

  const totalWidthPerColumn =
    containerWidth > 0 ? availableGridWidth / daysToShow : 0;

  const cellSize = (totalWidthPerColumn - 4) * 0.8;

  const styles = getStyles(theme, cellSize);

  const renderItem = useCallback(
    ({ item }: { item: GraphColumnData }) => {
      return (
        <GraphColumn
          data={item}
          cellSize={cellSize}
          columnWidth={totalWidthPerColumn}
        />
      );
    },
    [cellSize, totalWidthPerColumn],
  );

  if (containerWidth === 0) {
    return <View style={styles.placeholder} onLayout={onLayout} />;
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <FlatList
        ref={flatListRef}
        data={graphColumnsData}
        keyExtractor={(item) => item.date.toISOString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
        getItemLayout={(_, index) => ({
          length: totalWidthPerColumn,
          offset: totalWidthPerColumn * index,
          index,
        })}
        initialNumToRender={daysToShow + 5}
        maxToRenderPerBatch={daysToShow}
        windowSize={11}
      />
      <View style={styles.yAxis}>
        <View style={styles.yAxisHeaderSpacer} />
        {deeds.map((deed) => (
          <View key={deed.id} style={styles.yAxisItem}>
            <MaterialCommunityIcons
              name={deed.icon}
              size={cellSize * 1.2}
              color={theme.colors.textSecondary}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = (theme: AppTheme, cellSize: number) =>
  StyleSheet.create({
    placeholder: {
      height: (cellSize + 4) * 5 + 16 + theme.spacing.m * 2,
    },
    container: {
      flexDirection: "row",
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      paddingVertical: theme.spacing.m,
      paddingRight: theme.spacing.m,
    },
    yAxis: {
      justifyContent: "flex-start",
      marginLeft: theme.spacing.s,
    },
    yAxisHeaderSpacer: {
      height: 16,
      marginBottom: theme.spacing.xs,
    },
    yAxisItem: {
      height: cellSize + 4,
      justifyContent: "center",
      alignItems: "center",
    },
  });
