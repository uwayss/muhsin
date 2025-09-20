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
};

type AppActions = {
  initialize: () => Promise<void>;
  addOrUpdateLog: (
    deed: Deed,
    date: Date,
    status: DeedStatus,
    value?: number,
  ) => void;
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
  toggleDemoMode: () => Promise<void>;
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
  const dataToSave: AppData = {
    // Only save the user's actual deeds and logs, not the demo ones
    deeds: state.settings.isDemoMode ? MOCK_DEEDS : state.deeds,
    logs: state.settings.isDemoMode ? [] : state.logs,
    settings: state.settings,
  };

  // If demo mode is on, we save the user's real data from the original file load
  // to prevent it from being overwritten.
  const loadedData = useAppStore.getState();
  if (state.settings.isDemoMode && loadedData.isInitialized) {
    dataToSave.deeds = loadedData.deeds;
    dataToSave.logs = loadedData.logs;
  }

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

  // --- ACTIONS ---
  initialize: async () => {
    const loadedData = await loadDataFromFile();
    let settings = defaultSettings;
    let initialDeeds = MOCK_DEEDS;
    let initialLogs = MOCK_LOGS;

    if (loadedData) {
      settings = { ...defaultSettings, ...loadedData.settings };
      initialDeeds = loadedData.deeds;
      initialLogs = loadedData.logs;
    }

    set({ deeds: initialDeeds, logs: initialLogs, settings });

    // If demo mode was enabled last session, load the demo data over the user data
    if (settings.isDemoMode) {
      set({
        deeds: MOCK_DEEDS,
        logs: generateDemoLogs(),
      });
    }

    if (settings.theme !== "system") {
      Appearance.setColorScheme(settings.theme);
    }
    i18n.locale = settings.language;
    I18nManager.forceRTL(settings.language === "ar");

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
        { cancelable: false },
      );
    }
  },

  addOrUpdateLog: (deed, date, status, value) => {
    const dateString = formatISO(date, { representation: "date" });
    const currentLogs = get().logs;
    const existingLogIndex = currentLogs.findIndex(
      (log) => log.deedId === deed.id && log.date === dateString,
    );
    let newLogs: DeedLog[];
    if (existingLogIndex > -1) {
      newLogs = [...currentLogs];
      newLogs[existingLogIndex].statusId = status.id;
      newLogs[existingLogIndex].value = value;
    } else {
      const newLog: DeedLog = {
        id: `log-${Date.now()}`,
        deedId: deed.id,
        date: dateString,
        statusId: status.id,
        value,
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

  toggleDemoMode: async () => {
    const isCurrentlyDemo = get().settings.isDemoMode;
    const newIsDemo = !isCurrentlyDemo;

    set((state) => ({
      settings: { ...state.settings, isDemoMode: newIsDemo },
    }));

    if (newIsDemo) {
      // Enabling Demo Mode
      set({
        deeds: MOCK_DEEDS,
        logs: generateDemoLogs(),
      });
      Alert.alert(
        i18n.t("alerts.demoModeEnabledTitle"),
        i18n.t("alerts.demoModeEnabledMessage"),
      );
    } else {
      // Disabling Demo Mode: Reload user's original data from disk
      const originalData = await loadDataFromFile();
      set({
        deeds: originalData?.deeds || MOCK_DEEDS,
        logs: originalData?.logs || [],
      });
      Alert.alert(
        i18n.t("alerts.demoModeDisabledTitle"),
        i18n.t("alerts.demoModeDisabledMessage"),
      );
    }
    // Persist the new state of `isDemoMode` in settings
    persistState(get());
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
    await cancelAllReminders();
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
    if (get().settings.isReminderEnabled) {
      scheduleDailyReminder(time);
    }
    persistState(get());
  },
}));

export default useAppStore;
