// FILE: src/screens/CreateDeedScreen.tsx
import { Box } from "@/components/base/Box";
import { ThemedText } from "@/components/base/ThemedText";
import { ThemedTextInput } from "@/components/base/ThemedTextInput";
import { Screen } from "@/components/Screen";
import { AppTheme } from "@/constants/theme";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { IconSelectorModal } from "@/features/deeds/IconSelectorModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { HomeStackParamList } from "@/navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type CreateDeedScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "CreateDeed"
>;
type CreateDeedScreenRouteProp = RouteProp<HomeStackParamList, "CreateDeed">;

const CreateDeedScreen = () => {
  const navigation = useNavigation<CreateDeedScreenNavigationProp>();
  const route = useRoute<CreateDeedScreenRouteProp>();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const deedId = route.params?.deedId;
  const isEditMode = !!deedId;

  const {
    draftDeed,
    initializeDraftDeed,
    updateDraftDeed,
    clearDraftDeed,
    saveDraftDeed,
  } = useAppStore();
  const allDeeds = useAppStore((state) => state.deeds);

  const [isIconModalVisible, setIconModalVisible] = useState(false);

  useEffect(() => {
    initializeDraftDeed(deedId);
    return () => {
      clearDraftDeed();
    };
  }, [initializeDraftDeed, deedId, clearDraftDeed]);

  const handleSave = () => {
    if (!draftDeed?.name?.trim()) {
      Alert.alert(
        i18n.t("alerts.missingNameTitle"),
        i18n.t("alerts.missingNameMessage"),
      );
      return;
    }
    saveDraftDeed();
    navigation.goBack();
  };

  const handleSelectIcon = (
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"],
  ) => {
    updateDraftDeed({ icon });
    setIconModalVisible(false);
  };

  const getFrequencyLabel = () => {
    if (!draftDeed?.frequency) return i18n.t("deeds.notSet");
    if (draftDeed.frequency.type === "daily") return i18n.t("frequency.daily");
    if (draftDeed.frequency.type === "weekly") {
      const dayCount = draftDeed.frequency.days?.length || 0;
      return dayCount === 1
        ? i18n.t("deeds.weeklyLabel_singular", { dayCount })
        : i18n.t("deeds.weeklyLabel", { dayCount });
    }
    return i18n.t("deeds.notSet");
  };

  const getGoalLabel = () => {
    if (!draftDeed?.goal) return i18n.t("deeds.notSet");
    return `${draftDeed.goal.value} ${draftDeed.goal.unit}`;
  };

  const getParentLabel = () => {
    if (!draftDeed?.parentId) return i18n.t("deeds.none");
    const parent = allDeeds.find((d) => d.id === draftDeed.parentId);
    return parent
      ? i18n.t(`deeds_names.${parent.id}`, { defaultValue: parent.name })
      : i18n.t("deeds.none");
  };

  const screenTitle = isEditMode
    ? i18n.t("screens.editDeed")
    : i18n.t("screens.createDeed");

  if (!draftDeed) {
    return (
      <Screen title={screenTitle}>
        <ActivityIndicator style={{ marginTop: 20 }} />
      </Screen>
    );
  }

  return (
    <>
      <Screen
        title={screenTitle}
        renderLeftAction={() => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
        renderRightAction={() => (
          <TouchableOpacity onPress={handleSave}>
            <ThemedText style={styles.saveText}>
              {i18n.t("deeds.save")}
            </ThemedText>
          </TouchableOpacity>
        )}
      >
        <View style={styles.formContainer}>
          <Box style={styles.inputRow}>
            <TouchableOpacity
              style={styles.iconPicker}
              onPress={() => setIconModalVisible(true)}
            >
              <MaterialCommunityIcons
                name={draftDeed.icon}
                size={32}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <ThemedTextInput
              placeholder={i18n.t("deeds.deedNamePlaceholder")}
              value={draftDeed.name}
              onChangeText={(name) => updateDraftDeed({ name })}
              style={styles.textInput}
            />
          </Box>
          <ThemedText style={styles.sectionHeader}>
            {i18n.t("deeds.configuration")}
          </ThemedText>
          <ConfigRow
            icon="calendar-sync"
            label={i18n.t("deeds.frequency")}
            value={getFrequencyLabel()}
            onPress={() => navigation.navigate("ConfigureFrequency")}
          />
          <ConfigRow
            icon="bullseye-arrow"
            label={i18n.t("deeds.goal")}
            value={getGoalLabel()}
            onPress={() => navigation.navigate("ConfigureGoal")}
          />
          <ConfigRow
            icon="file-tree"
            label={i18n.t("deeds.parentDeed")}
            value={getParentLabel()}
            onPress={() => navigation.navigate("ConfigureParent")}
          />
        </View>
      </Screen>
      <IconSelectorModal
        isVisible={isIconModalVisible}
        onClose={() => setIconModalVisible(false)}
        onSelectIcon={handleSelectIcon}
      />
    </>
  );
};

// Helper component
const ConfigRow = ({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
  onPress?: () => void;
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity style={styles.configRow} onPress={onPress}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={theme.colors.textSecondary}
      />
      <ThemedText style={styles.configLabel}>{label}</ThemedText>
      <ThemedText style={styles.configValue}>{value}</ThemedText>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    saveText: {
      color: theme.colors.primary,
      fontWeight: theme.typography.fontWeight.semibold,
      fontSize: theme.typography.fontSize.m,
    },
    formContainer: {
      paddingTop: theme.spacing.m,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      padding: theme.spacing.s,
      borderWidth: 1,
      borderColor: theme.colors.background,
    },
    iconPicker: {
      padding: theme.spacing.s,
      marginEnd: theme.spacing.s,
    },
    textInput: {
      flex: 1,
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
    },
    sectionHeader: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.s,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.s,
    },
    configRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.m,
      backgroundColor: theme.colors.foreground,
      borderRadius: 8,
      marginBottom: theme.spacing.s,
    },
    configLabel: {
      flex: 1,
      marginStart: theme.spacing.m,
    },
    configValue: {
      color: theme.colors.textSecondary,
      marginEnd: theme.spacing.xs,
    },
  });
export default CreateDeedScreen;
