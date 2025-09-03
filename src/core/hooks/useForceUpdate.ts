import { useState, useCallback } from "react";
export const useForceUpdate = () => {
  const [, updateState] = useState({});
  return useCallback(() => updateState({}), []);
};
