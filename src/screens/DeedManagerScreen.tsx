// FILE: src/screens/DeedManagerScreen.tsx
import { Screen } from "@/components/Screen";
import { AppTheme } from "@/constants/theme";
import { Deed } from "@/core/data/models";
import i18n from "@/core/i18n";
import useAppStore from "@/core/store/appStore";
import { useTheme } from "@/core/theme/ThemeContext";
import { DeedManagerListItem } from "@/features/deeds/DeedManagerListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

const DeedManagerScreen = () => {
  const navigation = useNavigation();
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
      title={i18n.t("screens.deedManager")}
      renderLeftAction={() => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
