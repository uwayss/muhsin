// src/core/storage/storageService.ts
import * as FileSystem from "expo-file-system";
import { AppData } from "../store/appStore";

const dataFilePath = `${FileSystem.documentDirectory}muhsinData.json`;

/**
 * Loads the application data from the file system.
 * @returns {Promise<AppData | null>} The parsed data or null if it doesn't exist.
 */
export const loadDataFromFile = async (): Promise<AppData | null> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(dataFilePath);
    if (!fileInfo.exists) {
      console.log("Data file does not exist. Starting fresh.");
      return null;
    }
    const content = await FileSystem.readAsStringAsync(dataFilePath);
    return JSON.parse(content) as AppData;
  } catch (error) {
    console.error("Failed to load data from file:", error);
    // In case of parsing error, etc., we treat it as no data found.
    return null;
  }
};

/**
 * Saves the application data to the file system.
 * @param {AppData} data The data to save.
 */
export const saveDataToFile = async (data: AppData): Promise<void> => {
  try {
    const content = JSON.stringify(data, null, 2); // Pretty print JSON
    await FileSystem.writeAsStringAsync(dataFilePath, content);
  } catch (error) {
    console.error("Failed to save data to file:", error);
  }
};
