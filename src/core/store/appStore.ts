// src/core/store/appStore.ts
import { create } from "zustand";
import { Deed, DeedLog, DeedStatus } from "../data/models";
import { MOCK_DEEDS, MOCK_LOGS, SUGGESTED_DEEDS } from "../data/mock";
import { loadDataFromFile, saveDataToFile } from "../storage/storageService";
import { formatISO } from "date-fns";

// The shape of our entire persisted state
export type AppData = {
  deeds: Deed[];
  logs: DeedLog[];
};

// The full store state including transient (non-persisted) properties
type AppState = AppData & {
  isInitialized: boolean;
  suggestedDeeds: Deed[]; // Non-persisted list of available deeds
};

// Actions that can be performed on the store
type AppActions = {
  initialize: () => Promise<void>;
  addOrUpdateLog: (deed: Deed, date: Date, status: DeedStatus) => void;
  addDeed: (deed: Deed) => void;
};

const useAppStore = create<AppState & AppActions>((set, get) => ({
  // --- STATE ---
  deeds: [],
  logs: [],
  suggestedDeeds: SUGGESTED_DEEDS,
  isInitialized: false,

  // --- ACTIONS ---
  initialize: async () => {
    const loadedData = await loadDataFromFile();
    if (loadedData) {
      set(loadedData);
    } else {
      // First launch: use mock data as the initial state
      const initialState: AppData = {
        deeds: MOCK_DEEDS,
        logs: MOCK_LOGS,
      };
      set(initialState);
      // And save it so it persists for the next session
      await saveDataToFile(initialState);
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
      // Update existing log
      newLogs = [...currentLogs];
      newLogs[existingLogIndex].statusId = status.id;
    } else {
      // Create new log
      const newLog: DeedLog = {
        id: `log-${Date.now()}`,
        deedId: deed.id,
        date: dateString,
        statusId: status.id,
      };
      newLogs = [...currentLogs, newLog];
    }

    set({ logs: newLogs });
    // Persist changes to disk asynchronously
    saveDataToFile({ deeds: get().deeds, logs: newLogs });
  },

  addDeed: (deedToAdd) => {
    const currentDeeds = get().deeds;
    // Prevent duplicates
    if (currentDeeds.some((d) => d.id === deedToAdd.id)) return;

    const newDeeds = [...currentDeeds, deedToAdd];
    set({ deeds: newDeeds });
    saveDataToFile({ deeds: newDeeds, logs: get().logs });
  },
}));

export default useAppStore;
