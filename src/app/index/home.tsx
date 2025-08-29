import { StyleSheet, Text, View } from "react-native";
import React from "react";

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to </Text>
      <Text style={[styles.text, styles.emphasized]}>Your </Text>
      <Text style={styles.text}>Expo App!</Text>
    </View>
  );
};

export default index;

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
