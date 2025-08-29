// src/features/home/DateScroller.tsx
import {
  addYears,
  eachDayOfInterval,
  isSameDay,
  isToday,
  startOfWeek,
  subYears,
} from "date-fns";
import React, { useCallback, useMemo, useRef } from "react";
import { FlatList, useWindowDimensions } from "react-native";
import { DateItem, ITEM_MARGIN } from "./DateItem";

type DateScrollerProps = {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
};

const DateScrollerComponent = ({
  selectedDate,
  onDateSelect,
}: DateScrollerProps) => {
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = useWindowDimensions();

  const containerPadding = 32;
  const itemWidth = (screenWidth - containerPadding - ITEM_MARGIN * 7) / 7;
  const fullItemWidth = itemWidth + ITEM_MARGIN;
  const weekWidth = fullItemWidth * 7;

  const dateRange = useMemo(() => {
    const today = new Date();
    return eachDayOfInterval({
      start: subYears(today, 1),
      end: addYears(today, 1),
    });
  }, []);

  const todayIndex = useMemo(() => {
    // Find the start of the week for today
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
    return dateRange.findIndex((d) => isSameDay(d, startOfCurrentWeek));
  }, [dateRange]);

  const handleDatePress = useCallback(
    (date: Date) => {
      onDateSelect(date);
    },
    [onDateSelect],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: fullItemWidth,
      offset: fullItemWidth * index,
      index,
    }),
    [fullItemWidth],
  );

  const renderItem = useCallback(
    ({ item }: { item: Date }) => (
      <DateItem
        date={item}
        isSelected={isSameDay(item, selectedDate)}
        isToday={isToday(item)}
        onPress={() => handleDatePress(item)}
        itemWidth={itemWidth}
      />
    ),
    [selectedDate, handleDatePress, itemWidth],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={dateRange}
      keyExtractor={(item) => item.toISOString()}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={weekWidth} // Snap to a full week
      decelerationRate="fast"
      initialScrollIndex={todayIndex}
      getItemLayout={getItemLayout}
      style={{ flexGrow: 0, paddingVertical: 8 }}
    />
  );
};

// Export the memoized version, which now has a display name
export const DateScroller = React.memo(DateScrollerComponent);
