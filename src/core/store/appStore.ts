// src/core/store/appStore.ts
import { create } from "zustand";
import { Deed, DeedLog, DeedStatus } from "../data/models";
import {
  GENERIC_STATUSES,
  MOCK_DEEDS,
  MOCK_LOGS,
  SUGGESTED_DEEDS,
} from "../data/mock";
import { loadDataFromFile, saveDataToFile } from "../storage/storageService";
import { formatISO } from "date-fns";
import { Alert, Appearance, I18nManager } from "react-native";
import { generateDemoLogs } from "../data/demoData";
import i18n from "../i18n";
import {
  cancelAllReminders,
  scheduleDailyReminder,
} from "../services/notificationService";

export type AppSettings = {
  theme: "system" | "light" | "dark";
  isHapticsEnabled: boolean;
  isDevMode: boolean;
  isDemoMode: boolean;
  language: "en" | "ar"; // Updated language options
  isReminderEnabled: boolean;
  reminderTime: string;
};

export type AppData = {
  deeds: Deed[];
  logs: DeedLog[];
  settings: AppSettings;
};

// Add `id` to the payload to handle editing
export type CustomDeedPayload = Partial<Deed>;

type AppState = AppData & {
  isInitialized: boolean;
  suggestedDeeds: Deed[];
  draftDeed: CustomDeedPayload | null;
  // For demo mode
  originalDeeds: Deed[] | null;
  originalLogs: DeedLog[] | null;
};

type AppActions = {
  initialize: () => Promise<void>;
  addOrUpdateLog: (deed: Deed, date: Date, status: DeedStatus) => void;
  addDeed: (deed: Deed) => void;
  // DEED MANAGEMENT
  initializeDraftDeed: (deedId?: string) => void;
  updateDraftDeed: (payload: Partial<CustomDeedPayload>) => void;
  clearDraftDeed: () => void;
  saveDraftDeed: () => void;
  deleteDeed: (deedId: string) => void;
  setDeeds: (deeds: Deed[]) => void;
  // SETTINGS
  setTheme: (theme: AppSettings["theme"]) => void;
  setLanguage: (language: AppSettings["language"]) => void;
  toggleHaptics: () => void;
  setDevMode: (isDev: boolean) => void;
  toggleDemoMode: () => void;
  resetData: () => Promise<void>;
  toggleReminder: () => void;
  setReminderTime: (time: string) => void;
};

const defaultSettings: AppSettings = {
  theme: "system",
  isHapticsEnabled: true,
  isDevMode: false,
  isDemoMode: false,
  language: "en",
  isReminderEnabled: false,
  reminderTime: "20:00",
};

const persistState = (state: AppState) => {
  if (state.settings.isDemoMode) {
    console.log("Demo mode is active. Skipping data persistence.");
    return;
  }
  const dataToSave: AppData = {
    deeds: state.deeds,
    logs: state.logs,
    settings: state.settings,
  };
  saveDataToFile(dataToSave);
};

const useAppStore = create<AppState & AppActions>((set, get) => ({
  // --- STATE ---
  deeds: [],
  logs: [],
  settings: defaultSettings,
  suggestedDeeds: SUGGESTED_DEEDS,
  isInitialized: false,
  draftDeed: null,
  originalDeeds: null,
  originalLogs: null,

  // --- ACTIONS ---
  initialize: async () => {
    const loadedData = await loadDataFromFile();
    let settings = defaultSettings;
    if (loadedData) {
      settings = { ...defaultSettings, ...loadedData.settings };
      set({
        ...loadedData,
        settings,
      });
    } else {
      const initialState: AppData = {
        deeds: MOCK_DEEDS,
        logs: MOCK_LOGS,
        settings: defaultSettings,
      };
      set(initialState);
      await saveDataToFile(initialState);
    }
    // Set theme and language on initial load
    if (settings.theme !== "system") {
      Appearance.setColorScheme(settings.theme);
    }
    i18n.locale = settings.language;
    // This initial call sets the layout direction on first launch
    I18nManager.forceRTL(settings.language === "ar");

    // Ensure reminder is scheduled on app start if enabled
    if (settings.isReminderEnabled) {
      scheduleDailyReminder(settings.reminderTime);
    }

    set({ isInitialized: true });
  },

  setLanguage: (language) => {
    const currentLanguage = get().settings.language;
    if (currentLanguage === language) return;

    i18n.locale = language;
    const isRTL = language === "ar";
    const needsRestart = isRTL !== I18nManager.isRTL;

    // Update the state immediately so the UI (like the alert) uses the new language
    set((state) => ({ settings: { ...state.settings, language } }));
    persistState(get());

    if (needsRestart) {
      Alert.alert(
        i18n.t("alerts.restartTitle"),
        i18n.t("alerts.restartMessage"),
        [
          {
            text: i18n.t("alerts.cancel"),
            style: "cancel",
            onPress: () => {
              // If the user cancels, we must revert the change to avoid a broken state
              i18n.locale = currentLanguage;
              set((state) => ({
                settings: { ...state.settings, language: currentLanguage },
              }));
              persistState(get());
            },
          },
          {
            text: i18n.t("alerts.restartNow"),
            style: "default",
            onPress: async () => {
              I18nManager.forceRTL(isRTL);
            },
          },
        ],
        { cancelable: false }, // User must make a choice
      );
    }
  },

  addOrUpdateLog: (deed, date, status) => {
    const dateString = formatISO(date, { representation: "date" });
    const currentLogs = get().logs;
    const existingLogIndex = currentLogs.findIndex(
      (log) => log.deedId === deed.id && log.date === dateString,
    );
    let newLogs: DeedLog[];
    if (existingLogIndex > -1) {
      newLogs = [...currentLogs];
      newLogs[existingLogIndex].statusId = status.id;
    } else {
      const newLog: DeedLog = {
        id: `log-${Date.now()}`,
        deedId: deed.id,
        date: dateString,
        statusId: status.id,
      };
      newLogs = [...currentLogs, newLog];
    }
    set({ logs: newLogs });
    persistState(get());
  },

  addDeed: (deedToAdd) => {
    const currentDeeds = get().deeds;
    if (currentDeeds.some((d) => d.id === deedToAdd.id)) return;
    const newDeeds = [...currentDeeds, deedToAdd];
    set({ deeds: newDeeds });
    persistState(get());
  },

  initializeDraftDeed: (deedId) => {
    if (deedId) {
      const deedToEdit = get().deeds.find((d) => d.id === deedId);
      set({ draftDeed: deedToEdit ? { ...deedToEdit } : null });
    } else {
      set({
        draftDeed: {
          name: "",
          icon: "star-outline",
          frequency: { type: "daily" },
          category: "CUSTOM",
          statuses: GENERIC_STATUSES,
        },
      });
    }
  },

  updateDraftDeed: (payload) =>
    set((state) => ({
      draftDeed: state.draftDeed ? { ...state.draftDeed, ...payload } : null,
    })),

  clearDraftDeed: () => set({ draftDeed: null }),

  saveDraftDeed: () => {
    const draft = get().draftDeed;
    if (!draft || !draft.name || !draft.icon) return;

    if (draft.id) {
      const updatedDeed = draft as Deed;
      set((state) => ({
        deeds: state.deeds.map((d) => (d.id === draft.id ? updatedDeed : d)),
        draftDeed: null,
      }));
    } else {
      const newDeed: Deed = {
        id: `custom-${Date.now()}`,
        name: draft.name,
        icon: draft.icon,
        category: "CUSTOM",
        statuses: GENERIC_STATUSES,
        frequency: draft.frequency,
        goal: draft.goal,
        parentId: draft.parentId,
      };
      set((state) => ({ deeds: [...state.deeds, newDeed], draftDeed: null }));
    }
    persistState(get());
  },

  deleteDeed: (deedId) => {
    set((state) => ({
      deeds: state.deeds.filter((d) => d.id !== deedId),
      logs: state.logs.filter((l) => l.deedId !== deedId),
    }));
    persistState(get());
  },

  setDeeds: (deeds) => {
    set({ deeds });
    persistState(get());
  },

  setTheme: (theme) => {
    set((state) => ({ settings: { ...state.settings, theme } }));
    if (theme === "system") {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(theme);
    }
    persistState(get());
  },

  toggleHaptics: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        isHapticsEnabled: !state.settings.isHapticsEnabled,
      },
    }));
    persistState(get());
  },

  setDevMode: (isDev: boolean) => {
    set((state) => ({
      settings: { ...state.settings, isDevMode: isDev },
    }));
    persistState(get());
  },

  toggleDemoMode: () => {
    const { settings, originalDeeds, originalLogs, deeds, logs } = get();
    const { isDemoMode } = settings;

    if (!isDemoMode) {
      const demoLogs = generateDemoLogs();
      set({
        originalDeeds: deeds,
        originalLogs: logs,
        deeds: MOCK_DEEDS,
        logs: demoLogs,
        settings: { ...get().settings, isDemoMode: true },
      });
      Alert.alert(
        i18n.t("alerts.demoModeEnabledTitle"),
        i18n.t("alerts.demoModeEnabledMessage"),
      );
    } else {
      set({
        deeds: originalDeeds || MOCK_DEEDS,
        logs: originalLogs || [],
        originalDeeds: null,
        originalLogs: null,
        settings: { ...get().settings, isDemoMode: false },
      });
      Alert.alert(
        i18n.t("alerts.demoModeDisabledTitle"),
        i18n.t("alerts.demoModeDisabledMessage"),
      );
    }
  },

  resetData: async () => {
    const initialState: AppData = {
      deeds: MOCK_DEEDS,
      logs: [],
      settings: { ...defaultSettings, isDevMode: get().settings.isDevMode },
    };
    set(initialState);
    const theme = initialState.settings.theme;
    if (theme === "system") {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(theme);
    }
    await saveDataToFile(initialState);
    await cancelAllReminders(); // Also cancel reminders on reset
  },

  toggleReminder: () => {
    const isEnabled = get().settings.isReminderEnabled;
    const reminderTime = get().settings.reminderTime;
    const newIsEnabled = !isEnabled;

    if (newIsEnabled) {
      scheduleDailyReminder(reminderTime);
    } else {
      cancelAllReminders();
    }

    set((state) => ({
      settings: {
        ...state.settings,
        isReminderEnabled: newIsEnabled,
      },
    }));
    persistState(get());
  },

  setReminderTime: (time: string) => {
    set((state) => ({
      settings: { ...state.settings, reminderTime: time },
    }));
    // Only reschedule if the reminder is already enabled
    if (get().settings.isReminderEnabled) {
      scheduleDailyReminder(time);
    }
    persistState(get());
  },
}));

export default useAppStore;
