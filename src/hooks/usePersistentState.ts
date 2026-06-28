import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { loadAppState, saveAppState } from "../domain/persistence";
import type { AppState } from "../domain/types";

export function usePersistentState(): [AppState, Dispatch<SetStateAction<AppState>>] {
  const [state, setState] = useState<AppState>(() =>
    loadAppState(typeof window === "undefined" ? undefined : window.localStorage)
  );

  useEffect(() => {
    saveAppState(
      typeof window === "undefined" ? undefined : window.localStorage,
      state
    );
  }, [state]);

  return [state, setState];
}
