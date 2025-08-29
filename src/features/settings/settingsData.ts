// src/features/settings/settingsData.ts
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppSettings } from "@/core/store/appStore";

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

export type SettingsItem =
  | NavigationSettingsItem
  | ToggleSettingsItem
  | ModalSettingsItem<"theme">
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
    title: "Main Settings",
    data: [
      {
        type: "navigation",
        label: "Notifications",
        icon: "bell-outline",
        path: "/settings/notifications",
      },
      {
        type: "modal",
        label: "Appearance",
        icon: "palette-outline",
        title: "Appearance",
        stateKey: "theme",
        options: [
          { label: "System", value: "system" },
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
        ],
      },
      {
        type: "toggle",
        label: "Haptics",
        icon: "vibrate",
        stateKey: "isHapticsEnabled",
      },
    ],
  },
  {
    title: "Support & Feedback",
    data: [
      {
        type: "action",
        label: "Invite a friend",
        icon: "share-variant-outline",
        action: actions.invite,
      },
      {
        type: "action",
        label: "Rate the app",
        icon: "star-outline",
        action: actions.rate,
      },
      {
        type: "action",
        label: "Send feedback",
        icon: "email-outline",
        action: actions.feedback,
      },
      // --- THIS IS THE CHANGE ---
      {
        type: "action",
        label: "Privacy Policy",
        icon: "shield-lock-outline",
        action: actions.privacy,
      },
    ],
  },
  {
    title: "Danger Zone",
    data: [
      {
        type: "action",
        label: "Reset Everything",
        icon: "alert-circle-outline",
        action: actions.reset,
        color: "red",
      },
    ],
  },
];
