// src/app/settings/deed-manager.tsx
import { Screen } from "@/components/Screen";
import { AppTheme } from "@/constants/theme";
import { Deed } from "@/core/data/models";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { DeedManagerListItem } from "@/features/deeds/DeedManagerListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

const DeedManagerScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const deeds = useAppStore((state) => state.deeds);
  const setDeeds = useAppStore((state) => state.setDeeds);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Deed>) => {
    return (
      <DeedManagerListItem deed={item} drag={drag} isDragging={isActive} />
    );
  };

  return (
    <Screen
      title="Deed Manager"
      renderLeftAction={() => (
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      )}
    >
      <DraggableFlatList
        data={deeds}
        onDragEnd={({ data }) => setDeeds(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={getStyles(theme).listContent}
      />
    </Screen>
  );
};

export default DeedManagerScreen;

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    listContent: {
      paddingTop: theme.spacing.m,
      paddingHorizontal: theme.spacing.m,
    },
  });
