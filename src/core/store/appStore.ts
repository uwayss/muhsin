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
import { Alert, Appearance } from "react-native";
import { generateDemoLogs } from "../data/demoData";

export type AppSettings = {
  theme: "system" | "light" | "dark";
  isHapticsEnabled: boolean;
  isDevMode: boolean;
  isDemoMode: boolean;
  language: "en"; // For now, only English is supported
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
  toggleHaptics: () => void;
  setDevMode: (isDev: boolean) => void;
  toggleDemoMode: () => void;
  resetData: () => Promise<void>;
};

const defaultSettings: AppSettings = {
  theme: "system",
  isHapticsEnabled: true,
  isDevMode: false,
  isDemoMode: false,
  language: "en",
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
    if (loadedData) {
      set({
        ...loadedData,
        settings: { ...defaultSettings, ...loadedData.settings },
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
    const currentTheme = get().settings.theme;
    if (currentTheme !== "system") {
      Appearance.setColorScheme(currentTheme);
    }
    set({ isInitialized: true });
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

  // --- DEED MANAGEMENT ACTIONS ---
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
      // It's an update
      const updatedDeed = draft as Deed;
      set((state) => ({
        deeds: state.deeds.map((d) => (d.id === draft.id ? updatedDeed : d)),
        draftDeed: null,
      }));
    } else {
      // It's a new deed
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
      logs: state.logs.filter((l) => l.deedId !== deedId), // Also remove logs
    }));
    persistState(get());
  },

  setDeeds: (deeds) => {
    set({ deeds });
    persistState(get());
  },

  // --- SETTINGS ACTIONS ---
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
      // --- Entering Demo Mode ---
      const demoLogs = generateDemoLogs();
      set({
        originalDeeds: deeds, // Save current user data
        originalLogs: logs,
        deeds: MOCK_DEEDS, // Load mock deeds
        logs: demoLogs, // Load generated demo logs
        settings: { ...get().settings, isDemoMode: true },
      });
      Alert.alert(
        "Demo Mode Enabled",
        "App data has been replaced with sample data. Your original data is safe and will be restored when you disable demo mode.",
      );
    } else {
      // --- Exiting Demo Mode ---
      set({
        deeds: originalDeeds || MOCK_DEEDS, // Restore user data
        logs: originalLogs || [],
        originalDeeds: null, // Clear saved data
        originalLogs: null,
        settings: { ...get().settings, isDemoMode: false },
      });
      Alert.alert(
        "Demo Mode Disabled",
        "Your original data has been restored.",
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
  },
}));

export default useAppStore;
