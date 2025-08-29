// src/app/index/home.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { MOCK_DEEDS, MOCK_LOGS } from "@/core/data/mock";
import { DeedListItem } from "@/features/deeds/DeedListItem";
import React, { useState } from "react";
import { FlatList } from "react-native";

const HomeScreen = () => {
  // We'll manage the currently selected date in state.
  // Default to today for now.
  const [selectedDate] = useState("2025-08-29");

  // Get the logs for only the selected day
  const logsForSelectedDate = MOCK_LOGS.filter(
    (log) => log.date === selectedDate,
  );

  return (
    <Screen
      title="August 29" // We'll make this dynamic with the date scroller later
      subtitle="Dhul-Hijjah 1, 1446"
    >
      <FlatList
        data={MOCK_DEEDS}
        keyExtractor={(item) => item.id}
        renderItem={({ item: deed }) => {
          // Find the specific log for this deed on the selected day
          const log = logsForSelectedDate.find((l) => l.deedId === deed.id);
          return (
            <DeedListItem
              deed={deed}
              log={log}
              onPress={() => alert(`Log ${deed.name}`)}
            />
          );
        }}
        ListHeaderComponent={() => (
          // Group deeds by category
          <ThemedText style={{ marginBottom: 8, fontWeight: "bold" }}>
            Prayers
          </ThemedText>
        )}
      />
    </Screen>
  );
};

export default HomeScreen;
