// src/core/storage/storageService.ts
import * as FileSystem from 'expo-file-system';
import { createMMKV } from 'react-native-mmkv';
import { AppData } from '../store/appStore';

const storage = createMMKV();
const DATA_KEY = 'muhsinData';
const legacyDataFilePath = `${FileSystem.documentDirectory}muhsinData.json`;

/**
 * Loads the application data from storage.
 * It will first try to load from MMKV. If it's not found, it will attempt
 * to migrate from the legacy file system.
 * @returns {Promise<AppData | null>} The parsed data or null if it doesn't exist.
 */
export const loadData = async (): Promise<AppData | null> => {
  try {
    // 1. Try to load from MMKV (new storage)
    const storedData = storage.getString(DATA_KEY);
    if (storedData) {
      return JSON.parse(storedData) as AppData;
    }

    // 2. If no data in MMKV, try to migrate from FileSystem (legacy storage)
    console.log('No data in MMKV. Checking legacy FileSystem storage...');
    const fileInfo = await FileSystem.getInfoAsync(legacyDataFilePath);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(legacyDataFilePath);
      const data = JSON.parse(content) as AppData;

      // Migrate to MMKV
      console.log('Migrating legacy data to MMKV...');
      saveData(data);

      return data;
    }

    console.log('No legacy data found. Starting fresh.');
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
