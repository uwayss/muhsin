// src/features/deeds/LogGoalModal.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedLog } from "@/core/data/models";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { triggerHaptic } from "@/core/utils/haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatISO } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ChildDeedLogItem } from "./ChildDeedLogItem";

type LogGoalModalProps = {
  deed: Deed | null;
  log: DeedLog | undefined;
  date: Date;
  isVisible: boolean;
  onClose: () => void;
  onLogGoal: (value: number) => void;
};

export const LogGoalModal = ({
  deed,
  log,
  date,
  isVisible,
  onClose,
  onLogGoal,
}: LogGoalModalProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [value, setValue] = useState(0);

  const allDeeds = useAppStore((state) => state.deeds);
  const allLogs = useAppStore((state) => state.logs);

  const childDeeds = useMemo(() => {
    if (!deed) return [];
    return allDeeds.filter((d) => d.parentId === deed.id);
  }, [deed, allDeeds]);

  const logsForDate = useMemo(() => {
    const dateString = formatISO(date, { representation: "date" });
    return allLogs.filter((log) => log.date === dateString);
  }, [date, allLogs]);

  useEffect(() => {
    if (isVisible) {
      setValue(log?.value || 0);
    }
  }, [isVisible, log]);

  if (!deed || !deed.goal) return null;

  const handleSave = () => {
    triggerHaptic();
    onLogGoal(value);
  };

  const handleIncrement = () => {
    setValue((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setValue((prev) => Math.max(0, prev - 1));
  };

  const deedName = i18n.t(`deeds_names.${deed.id}`, {
    defaultValue: deed.name,
  });

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableOpacity activeOpacity={1} style={styles.container}>
            <ScrollView>
              <Box style={styles.header}>
                <MaterialCommunityIcons
                  name={deed.icon}
                  size={32}
                  color={theme.colors.text}
                />
                <ThemedText style={styles.title}>
                  {i18n.t("deeds.logDeedTitle", { deedName })}
                </ThemedText>
              </Box>

              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={handleDecrement}
                >
                  <MaterialCommunityIcons
                    name="minus-circle-outline"
                    size={48}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>

                <View style={styles.valueDisplay}>
                  <ThemedText style={styles.counterValue}>{value}</ThemedText>
                  <ThemedText style={styles.unitLabel}>
                    {deed.goal.unit}
                  </ThemedText>
                </View>

                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={handleIncrement}
                >
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={48}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <ThemedText style={styles.saveButtonText}>
                  {i18n.t("deeds.save")}
                </ThemedText>
              </TouchableOpacity>

              {childDeeds.length > 0 && (
                <View style={styles.childDeedsContainer}>
                  <ThemedText style={styles.childDeedsTitle}>
                    {i18n.t("deeds.linkedDeeds")}
                  </ThemedText>
                  {childDeeds.map((child) => {
                    const childLog = logsForDate.find(
                      (l) => l.deedId === child.id,
                    );
                    return (
                      <ChildDeedLogItem
                        key={child.id}
                        deed={child}
                        log={childLog}
                        date={date}
                      />
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      padding: theme.spacing.l,
    },
    container: {
      width: "100%",
      maxHeight: "80%",
      backgroundColor: theme.colors.foreground,
      borderRadius: 16,
      padding: theme.spacing.l,
    },
    header: {
      alignItems: "center",
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: theme.typography.fontWeight.semibold,
      textAlign: "center",
      marginTop: theme.spacing.m,
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginBottom: theme.spacing.m,
    },
    counterButton: {
      padding: theme.spacing.s,
    },
    valueDisplay: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 100,
    },
    counterValue: {
      fontSize: 48,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary,
    },
    unitLabel: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.textSecondary,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.m,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: theme.spacing.l,
    },
    saveButtonText: {
      color: theme.colors.primaryContrast,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    childDeedsContainer: {
      marginTop: theme.spacing.l,
      paddingTop: theme.spacing.m,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background,
    },
    childDeedsTitle: {
      fontSize: theme.typography.fontSize.s,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: theme.spacing.s,
    },
  });
