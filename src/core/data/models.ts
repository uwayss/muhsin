// FILE: src/core/data/models.ts
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorTheme } from "@/constants/theme";

/**
 * Represents a single possible status for a deed.
 * This drives the UI in the "Log Deed" modal.
 */
export type DeedStatus = {
  id: string; // e.g., 'on-time', 'completed'
  label: string; // e.g., "On time"
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  // Use keys of our theme colors for type safety
  color: keyof Pick<
    ColorTheme,
    "jamaah" | "onTime" | "late" | "missed" | "primary"
  >;
};

/**
 * Defines the frequency of a deed.
 * - 'daily': The deed is available every day.
 * - 'weekly': The deed is available on specific days of the week.
 * - 'monthly': The deed has a target count per month.
 * - 'yearly': The deed has a target count per year.
 */
export type DeedFrequency = {
  type: "daily" | "weekly" | "monthly" | "yearly";
  // For 'weekly', an array of numbers representing days (0=Sun, 1=Mon, ..., 6=Sat)
  days?: number[];
  // For 'monthly' or 'yearly', the target number of times
  count?: number;
};

/**
 * Defines an optional goal for a deed.
 */
export type DeedGoal = {
  value: number;
  unit: string; // e.g., "Pages", "Minutes", "Times"
};

/**
 * Represents a deed that the user is tracking.
 */
export type Deed = {
  id: string; // e.g., 'prayer-fajr'
  name: string; // e.g., "Fajr"
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  category: "PRAYERS" | "QURAN" | "LEARNING" | "SOCIAL" | "CUSTOM";
  statuses: DeedStatus[];
  isCore?: boolean; // True for fundamental deeds that cannot be edited/deleted
  frequency?: DeedFrequency;
  goal?: DeedGoal;
  parentId?: string | null;
};

/**
 * Represents a log entry for a specific deed on a specific day.
 */
export type DeedLog = {
  id: string; // Unique ID for the log entry
  deedId: string; // Foreign key to the Deed
  date: string; // ISO 8601 date string (e.g., "2025-08-29")
  statusId: string; // Foreign key to the DeedStatus
};
