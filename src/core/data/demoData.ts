// src/core/data/demoData.ts
import { subDays, formatISO } from "date-fns";
import { DeedLog } from "./models";

const PRAYER_DEED_IDS = [
  "prayer-fajr",
  "prayer-dhuhr",
  "prayer-asr",
  "prayer-maghrib",
  "prayer-isha",
];

// Weighted random selection to make data look more realistic
const getRandomStatusId = (): string => {
  const rand = Math.random();
  if (rand < 0.4) return "jamaah"; // 40% chance
  if (rand < 0.75) return "on-time"; // 35% chance
  if (rand < 0.95) return "late"; // 20% chance
  return "missed"; // 5% chance
};

export const generateDemoLogs = (): DeedLog[] => {
  const logs: DeedLog[] = [];
  const today = new Date();
  const daysToGenerate = 90;

  for (let i = 0; i < daysToGenerate; i++) {
    const date = subDays(today, i);
    const dateString = formatISO(date, { representation: "date" });

    for (const deedId of PRAYER_DEED_IDS) {
      // Add a chance to skip logging a deed for a day to create gaps
      if (Math.random() > 0.1) {
        const statusId = getRandomStatusId();
        logs.push({
          id: `log-${deedId}-${dateString}`,
          deedId,
          date: dateString,
          statusId,
        });
      }
    }
  }

  return logs;
};
