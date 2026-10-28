import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react';
import { defaultPreferences, parsePreferences, PREFERENCES_KEY, type LearningPreferences } from '../utils/preferences';
interface PreferencesValue {
  preferences: LearningPreferences;
  updatePreferences: (patch: Partial<LearningPreferences>) => void;
  storageError: boolean;
}
const PreferencesContext = createContext<PreferencesValue | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(() => {
    try { return parsePreferences(localStorage.getItem(PREFERENCES_KEY)); }
    catch { return { ...defaultPreferences }; }
  });
  const [storageError, setStorageError] = useState(false);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.reducedMotion = String(preferences.reducedMotion);
  }, [preferences.theme, preferences.reducedMotion]);
  function updatePreferences(patch: Partial<LearningPreferences>) {
    const next = { ...preferences, ...patch };
    try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
    setPreferences(next);
  }
  return <PreferencesContext.Provider value={{ preferences, updatePreferences, storageError }}>{children}</PreferencesContext.Provider>;
}
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('PreferencesProvider missing');
  return context;
}
