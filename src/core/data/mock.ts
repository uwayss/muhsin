// src/core/data/mock.ts
import { Deed, DeedLog, DeedStatus } from "./models";

const PRAYER_STATUSES: DeedStatus[] = [
  { id: "missed", label: "Not Prayed", icon: "close-circle", color: "missed" },
  { id: "late", label: "Late", icon: "clock-alert", color: "late" },
  { id: "on-time", label: "On Time", icon: "clock-check", color: "onTime" },
  { id: "jamaah", label: "In Jama'ah", icon: "check-all", color: "jamaah" },
];

export const MOCK_DEEDS: Deed[] = [
  {
    id: "prayer-fajr",
    name: "Fajr",
    icon: "weather-sunset-up",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
  },
  {
    id: "prayer-dhuhr",
    name: "Dhuhr",
    icon: "weather-sunny",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
  },
  {
    id: "prayer-asr",
    name: "Asr",
    icon: "weather-partly-cloudy",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
  },
  {
    id: "prayer-maghrib",
    name: "Maghrib",
    icon: "weather-sunset-down",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
  },
  {
    id: "prayer-isha",
    name: "Isha",
    icon: "weather-night",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
  },
];

export const MOCK_LOGS: DeedLog[] = [
  // Today's logs
  {
    id: "log-1",
    deedId: "prayer-fajr",
    date: "2025-08-29",
    statusId: "jamaah",
  },
  {
    id: "log-2",
    deedId: "prayer-dhuhr",
    date: "2025-08-29",
    statusId: "on-time",
  },
  // Yesterday's logs
  {
    id: "log-3",
    deedId: "prayer-fajr",
    date: "2025-08-28",
    statusId: "on-time",
  },
  {
    id: "log-4",
    deedId: "prayer-dhuhr",
    date: "2025-08-28",
    statusId: "late",
  },
  {
    id: "log-5",
    deedId: "prayer-asr",
    date: "2025-08-28",
    statusId: "jamaah",
  },
];
