// src/features/settings/settingsData.ts
import i18n from "@/core/i18n";
import { AppSettings } from "@/core/store/appStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// --- Type Definitions ---
type BaseSettingsItem = {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

export type NavigationSettingsItem = BaseSettingsItem & {
  type: "navigation";
  path: string;
};

export type ToggleSettingsItem = BaseSettingsItem & {
  type: "toggle";
  stateKey: keyof Pick<AppSettings, "isHapticsEnabled">;
};

export type ModalSettingsItem<T extends keyof AppSettings> =
  BaseSettingsItem & {
    type: "modal";
    title: string;
    stateKey: T;
    options: { label: string; value: AppSettings[T] }[];
  };

export type ActionSettingsItem = BaseSettingsItem & {
  type: "action";
  action: () => void;
  color?: string;
};

// --- CORRECTED LINE ---
// ActionSettingsItem was missing from this union, causing all the errors.
export type SettingsItem =
  | NavigationSettingsItem
  | ToggleSettingsItem
  | ModalSettingsItem<"theme">
  | ModalSettingsItem<"language">
  | ActionSettingsItem;

export type SettingsSection = {
  title: string;
  data: SettingsItem[];
};

// --- Data Definition ---
export const getSettingsData = (actions: {
  [key: string]: () => void;
}): SettingsSection[] => [
  {
    title: i18n.t("settings.mainSettingsTitle"),
    data: [
      {
        type: "navigation",
        label: i18n.t("settings.deedManager"),
        icon: "format-list-bulleted-square",
        path: "/settings/deed-manager",
      },
      {
        type: "navigation",
        label: i18n.t("settings.notifications"),
        icon: "bell-outline",
        path: "/settings/notifications",
      },
      {
        type: "modal",
        label: i18n.t("settings.appearance"),
        icon: "palette-outline",
        title: i18n.t("settings.appearanceTitle"),
        stateKey: "theme",
        options: [
          { label: i18n.t("settings.system"), value: "system" },
          { label: i18n.t("settings.light"), value: "light" },
          { label: i18n.t("settings.dark"), value: "dark" },
        ],
      },
      {
        type: "toggle",
        label: i18n.t("settings.haptics"),
        icon: "vibrate",
        stateKey: "isHapticsEnabled",
      },
      {
        type: "modal",
        label: i18n.t("settings.appLanguage"),
        icon: "translate",
        title: i18n.t("settings.languageTitle"),
        stateKey: "language",
        options: [
          { label: i18n.t("settings.english"), value: "en" },
          { label: i18n.t("settings.arabic"), value: "ar" },
        ],
      },
    ],
  },
  {
    title: i18n.t("settings.supportTitle"),
    data: [
      {
        type: "action",
        label: i18n.t("settings.invite"),
        icon: "share-variant-outline",
        action: actions.invite,
      },
      {
        type: "action",
        label: i18n.t("settings.rate"),
        icon: "star-outline",
        action: actions.rate,
      },
      {
        type: "action",
        label: i18n.t("settings.feedback"),
        icon: "email-outline",
        action: actions.feedback,
      },
      {
        type: "action",
        label: i18n.t("settings.privacy"),
        icon: "shield-lock-outline",
        action: actions.privacy,
      },
    ],
  },
  {
    title: i18n.t("settings.dangerZoneTitle"),
    data: [
      {
        type: "action",
        label: i18n.t("settings.reset"),
        icon: "alert-circle-outline",
        action: actions.reset,
        color: "red",
      },
    ],
  },
];
