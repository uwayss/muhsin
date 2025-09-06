// src/features/deeds/LogDeedModal.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { AppTheme } from "@/constants/theme";
import { Deed, DeedStatus } from "@/core/data/models";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatISO } from "date-fns";
import React, { useMemo } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { ChildDeedLogItem } from "./ChildDeedLogItem";

type LogDeedModalProps = {
  deed: Deed | null;
  date: Date;
  isVisible: boolean;
  onClose: () => void;
  onLogStatus: (status: DeedStatus) => void;
};

export const LogDeedModal = ({
  deed,
  date,
  isVisible,
  onClose,
  onLogStatus,
}: LogDeedModalProps) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

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

  if (!deed) return null;

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
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
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
            <View>
              {deed.statuses.map((status) => {
                const statusLabelKey =
                  deed.isCore || status.id !== "missed"
                    ? `deeds_statuses.${status.id}`
                    : `deeds_statuses.generic-missed`;
                return (
                  <TouchableOpacity
                    key={status.id}
                    style={styles.optionRow}
                    onPress={() => onLogStatus(status)}
                  >
                    <MaterialCommunityIcons
                      name={status.icon}
                      size={24}
                      color={theme.colors[status.color]}
                    />
                    <ThemedText style={styles.optionLabel}>
                      {i18n.t(statusLabelKey, {
                        defaultValue: status.id.replace("-", " "),
                      })}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {childDeeds.length > 0 && (
              <View style={styles.childDeedsContainer}>
                <ThemedText style={styles.childDeedsTitle}>
                  {i18n.t("deeds.linkedDeeds")}
                </ThemedText>
                {childDeeds.map((child) => {
                  const log = logsForDate.find((l) => l.deedId === child.id);
                  return (
                    <ChildDeedLogItem
                      key={child.id}
                      deed={child}
                      log={log}
                      date={date}
                    />
                  );
                })}
              </View>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
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
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.m,
    },
    optionLabel: {
      marginStart: theme.spacing.m,
      fontSize: theme.typography.fontSize.m,
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
