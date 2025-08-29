// src/app/index/add-deed.tsx
import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/base/ThemedText";
import { useTheme } from "@/core/theme/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const AddDeedScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <Screen
      title="Add a Deed"
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
      <ThemedText>
        This is where the user will add or create new deeds.
      </ThemedText>
    </Screen>
  );
};

export default AddDeedScreen;
