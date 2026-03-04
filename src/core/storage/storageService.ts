// src/core/storage/storageService.ts
import { createMMKV } from 'react-native-mmkv';
import { AppData } from '../store/appStore';

const storage = createMMKV();
const DATA_KEY = 'muhsinData';

/**
 * Loads the application data from storage.
 * @returns {Promise<AppData | null>} The parsed data or null if it doesn't exist.
 */
export const loadData = async (): Promise<AppData | null> => {
  try {
    const storedData = storage.getString(DATA_KEY);
    if (storedData) {
      return JSON.parse(storedData) as AppData;
    }

    return null;
  } catch (error) {
    console.error('Failed to load data from storage:', error);
    return null;
  }
};

/**
 * Saves the application data to MMKV storage.
 * @param {AppData} data The data to save.
 */
export const saveData = (data: AppData): void => {
  try {
    storage.set(DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to MMKV:', error);
  }
};
