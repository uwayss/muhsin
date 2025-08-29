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

// The shape of our entire persisted state
export type AppData = {
  deeds: Deed[];
  logs: DeedLog[];
};

export type CustomDeedPayload = Pick<Deed, "name" | "icon"> &
  Partial<Pick<Deed, "frequency" | "goal" | "parentId">>;

// The full store state including transient (non-persisted) properties
type AppState = AppData & {
  isInitialized: boolean;
  suggestedDeeds: Deed[];
  draftDeed: CustomDeedPayload | null; // For multi-screen creation flow
};

// Actions that can be performed on the store
type AppActions = {
  initialize: () => Promise<void>;
  addOrUpdateLog: (deed: Deed, date: Date, status: DeedStatus) => void;
  addDeed: (deed: Deed) => void;
  // --- DRAFT DEED ACTIONS ---
  startCreatingDeed: () => void;
  updateDraftDeed: (payload: Partial<CustomDeedPayload>) => void;
  clearDraftDeed: () => void;
  saveDraftDeed: () => void;
};

const useAppStore = create<AppState & AppActions>((set, get) => ({
  // --- STATE ---
  deeds: [],
  logs: [],
  suggestedDeeds: SUGGESTED_DEEDS,
  isInitialized: false,
  draftDeed: null,

  // --- ACTIONS ---
  initialize: async () => {
    const loadedData = await loadDataFromFile();
    if (loadedData) {
      set(loadedData);
    } else {
      const initialState: AppData = {
        deeds: MOCK_DEEDS,
        logs: MOCK_LOGS,
      };
      set(initialState);
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
    saveDataToFile({ deeds: get().deeds, logs: newLogs });
  },

  addDeed: (deedToAdd) => {
    const currentDeeds = get().deeds;
    if (currentDeeds.some((d) => d.id === deedToAdd.id)) return;
    const newDeeds = [...currentDeeds, deedToAdd];
    set({ deeds: newDeeds });
    saveDataToFile({ deeds: newDeeds, logs: get().logs });
  },

  // --- DRAFT DEED ACTIONS IMPLEMENTATION ---
  startCreatingDeed: () => {
    set({
      draftDeed: {
        name: "",
        icon: "star-outline",
        frequency: { type: "daily" },
      },
    });
  },

  updateDraftDeed: (payload) => {
    set((state) => ({
      draftDeed: state.draftDeed ? { ...state.draftDeed, ...payload } : null,
    }));
  },

  clearDraftDeed: () => {
    set({ draftDeed: null });
  },

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
    const newDeeds = [...get().deeds, newDeed];
    set({ deeds: newDeeds, draftDeed: null }); // Clear draft after saving
    saveDataToFile({ deeds: newDeeds, logs: get().logs });
  },
}));

export default useAppStore;
