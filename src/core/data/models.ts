// src/core/data/models.ts
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
 * Represents a deed that the user is tracking.
 */
export type Deed = {
  id: string; // e.g., 'prayer-fajr'
  name: string; // e.g., "Fajr"
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  category: "PRAYERS" | "QURAN" | "SOCIAL" | "CUSTOM";
  // Each deed defines its own set of possible completion statuses
  statuses: DeedStatus[];
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
