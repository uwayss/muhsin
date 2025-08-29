import { StyleSheet, Text, View } from "react-native";
import React from "react";

const StatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.emphasized]}>Stats</Text>
    </View>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "300",
  },
  emphasized: {
    fontStyle: "italic",
    fontWeight: "600",
  },
});
