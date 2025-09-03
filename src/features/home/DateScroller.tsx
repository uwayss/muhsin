// src/features/home/DateScroller.tsx
import {
  addYears,
  eachDayOfInterval,
  isSameDay,
  isToday,
  startOfWeek,
  subYears,
  Locale,
} from "date-fns";
import React, { useCallback, useMemo, useRef } from "react";
import { FlatList, useWindowDimensions, I18nManager } from "react-native";
import { DateItem, ITEM_MARGIN } from "./DateItem";

type DateScrollerProps = {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  locale: Locale;
};

const DateScrollerComponent = ({
  selectedDate,
  onDateSelect,
  locale,
}: DateScrollerProps) => {
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = useWindowDimensions();

  const numberOfVisibleDays = I18nManager.isRTL ? 5 : 7;
  const containerPadding = 32;

  const itemWidth =
    (screenWidth - containerPadding - numberOfVisibleDays * ITEM_MARGIN * 2) /
    numberOfVisibleDays;

  const dateRange = useMemo(() => {
    const today = new Date();
    return eachDayOfInterval({
      start: subYears(today, 1),
      end: addYears(today, 1),
    });
  }, []);

  const todayIndex = useMemo(() => {
    const startOfCurrentWeek = startOfWeek(new Date(), {
      weekStartsOn: locale.options?.weekStartsOn,
    });
    return dateRange.findIndex((d) => isSameDay(d, startOfCurrentWeek));
  }, [dateRange, locale]);

  const handleDatePress = useCallback(
    (date: Date) => {
      onDateSelect(date);
    },
    [onDateSelect],
  );

  const renderItem = useCallback(
    ({ item }: { item: Date }) => (
      <DateItem
        date={item}
        isSelected={isSameDay(item, selectedDate)}
        isToday={isToday(item)}
        onPress={() => handleDatePress(item)}
        locale={locale}
        itemWidth={itemWidth}
      />
    ),
    [selectedDate, handleDatePress, locale, itemWidth],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={dateRange}
      keyExtractor={(item) => item.toISOString()}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={todayIndex}
      getItemLayout={(_, index) => ({
        length: itemWidth + ITEM_MARGIN * 2,
        offset: (itemWidth + ITEM_MARGIN * 2) * index,
        index,
      })}
      style={{ flexGrow: 0, paddingVertical: 8 }}
      contentContainerStyle={{ height: 70 }} // Apply height here to ensure items can fill it
    />
  );
};

export const DateScroller = React.memo(DateScrollerComponent);
