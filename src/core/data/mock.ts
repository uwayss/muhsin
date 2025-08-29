// src/core/data/mock.ts
import { Deed, DeedLog, DeedStatus } from "./models";

const PRAYER_STATUSES: DeedStatus[] = [
  { id: "missed", label: "Not Prayed", icon: "close-circle", color: "missed" },
  { id: "late", label: "Late", icon: "clock-alert", color: "late" },
  { id: "on-time", label: "On Time", icon: "clock-check", color: "onTime" },
  { id: "jamaah", label: "In Jama'ah", icon: "check-all", color: "jamaah" },
];

export const GENERIC_STATUSES: DeedStatus[] = [
  { id: "missed", label: "Missed", icon: "close", color: "late" },
  { id: "completed", label: "Completed", icon: "check", color: "primary" },
];

export const MOCK_DEEDS: Deed[] = [
  {
    id: "prayer-fajr",
    name: "Fajr",
    icon: "weather-sunset-up",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
    isCore: true,
  },
  {
    id: "prayer-dhuhr",
    name: "Dhuhr",
    icon: "weather-sunny",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
    isCore: true,
  },
  {
    id: "prayer-asr",
    name: "Asr",
    icon: "weather-partly-cloudy",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
    isCore: true,
  },
  {
    id: "prayer-maghrib",
    name: "Maghrib",
    icon: "weather-sunset-down",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
    isCore: true,
  },
  {
    id: "prayer-isha",
    name: "Isha",
    icon: "weather-night",
    category: "PRAYERS",
    statuses: PRAYER_STATUSES,
    isCore: true,
  },
];

export const SUGGESTED_DEEDS: Deed[] = [
  // PRAYERS
  {
    id: "prayer-witr",
    name: "Witr",
    icon: "moon-waning-crescent",
    category: "PRAYERS",
    statuses: GENERIC_STATUSES,
    isCore: false,
  },
  {
    id: "prayer-tahajjud",
    name: "Tahajjud",
    icon: "meditation",
    category: "PRAYERS",
    statuses: GENERIC_STATUSES,
    isCore: false,
  },
  // QURAN
  {
    id: "quran-reading",
    name: "Read Quran",
    icon: "book-open-page-variant",
    category: "QURAN",
    statuses: GENERIC_STATUSES,
    isCore: false,
  },
  {
    id: "quran-memorizing",
    name: "Memorize Quran",
    icon: "brain",
    category: "QURAN",
    statuses: GENERIC_STATUSES,
    isCore: false,
  },
  // LEARNING
  {
    id: "learning-book",
    name: "Read a book",
    icon: "book-education",
    category: "LEARNING",
    statuses: GENERIC_STATUSES,
    isCore: false,
  },
  // SOCIAL
  {
    id: "social-charity",
    name: "Give Charity",
    icon: "charity",
    category: "SOCIAL",
    statuses: GENERIC_STATUSES,
    isCore: false,
  },
  {
    id: "social-family",
    name: "Call family",
    icon: "phone-in-talk",
    category: "SOCIAL",
    statuses: GENERIC_STATUSES,
    isCore: false,
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
