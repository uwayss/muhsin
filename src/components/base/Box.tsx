// src/components/base/Box.tsx
import { View, ViewProps } from "react-native";
import React from "react";

// For now, it's a simple pass-through.
// It establishes a pattern for a component that will become more powerful.
export const Box = (props: ViewProps) => {
  return <View {...props} />;
};
