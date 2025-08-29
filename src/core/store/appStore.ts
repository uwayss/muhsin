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
import { Appearance } from "react-native";

export type AppSettings = {
  theme: "system" | "light" | "dark";
  isHapticsEnabled: boolean;
};

// The shape of our entire persisted state
export type AppData = {
  deeds: Deed[];
  logs: DeedLog[];
  settings: AppSettings;
};

export type CustomDeedPayload = Pick<Deed, "name" | "icon"> &
  Partial<Pick<Deed, "frequency" | "goal" | "parentId">>;

// The full store state including transient (non-persisted) properties
type AppState = AppData & {
  isInitialized: boolean;
  suggestedDeeds: Deed[];
  draftDeed: CustomDeedPayload | null;
};

// Actions that can be performed on the store
type AppActions = {
  initialize: () => Promise<void>;
  addOrUpdateLog: (deed: Deed, date: Date, status: DeedStatus) => void;
  addDeed: (deed: Deed) => void;
  // DRAFT DEED ACTIONS
  startCreatingDeed: () => void;
  updateDraftDeed: (payload: Partial<CustomDeedPayload>) => void;
  clearDraftDeed: () => void;
  saveDraftDeed: () => void;
  setTheme: (theme: AppSettings["theme"]) => void;
  toggleHaptics: () => void;
};

const defaultSettings: AppSettings = {
  theme: "system",
  isHapticsEnabled: true,
};

// Helper function to persist the current state
const persistState = (state: AppState) => {
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
  settings: defaultSettings, // Initialize with defaults
  suggestedDeeds: SUGGESTED_DEEDS,
  isInitialized: false,
  draftDeed: null,

  // --- ACTIONS ---
  initialize: async () => {
    const loadedData = await loadDataFromFile();
    if (loadedData) {
      set({
        ...loadedData,
        settings: { ...defaultSettings, ...loadedData.settings }, // Merge settings
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
    // Set the initial color scheme based on settings
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

  // DRAFT DEED ACTIONS
  startCreatingDeed: () =>
    set({
      draftDeed: {
        name: "",
        icon: "star-outline",
        frequency: { type: "daily" },
      },
    }),
  updateDraftDeed: (payload) =>
    set((state) => ({
      draftDeed: state.draftDeed ? { ...state.draftDeed, ...payload } : null,
    })),
  clearDraftDeed: () => set({ draftDeed: null }),
  saveDraftDeed: () => {
    const draft = get().draftDeed;
    if (!draft || !draft.name || !draft.icon) return;
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
    persistState(get());
  },

  // --- SETTINGS ACTIONS IMPLEMENTATION ---
  setTheme: (theme) => {
    set((state) => ({ settings: { ...state.settings, theme } }));
    // Immediately update the app's appearance
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
}));

export default useAppStore;
