// src/core/utils/haptics.ts
import * as Haptics from "expo-haptics";
import useAppStore from "../store/appStore";

/**
 * Triggers haptic feedback if the user has it enabled in settings.
 * @param {Haptics.ImpactFeedbackStyle} style - The intensity of the feedback.
 */
export const triggerHaptic = (
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
) => {
  const isHapticsEnabled = useAppStore.getState().settings.isHapticsEnabled;
  if (isHapticsEnabled) {
    Haptics.impactAsync(style);
  }
};
