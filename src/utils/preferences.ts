export interface LearningPreferences {
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  explanations: 'always' | 'on-request';
}
export const PREFERENCES_KEY = 'algebra-lab.preferences.v1';
export const defaultPreferences: LearningPreferences = {
  theme: 'dark', reducedMotion: true, explanations: 'always',
};
export function parsePreferences(raw: string | null): LearningPreferences {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object') return { ...defaultPreferences };
    const p = value as Record<string, unknown>;
    return {
      theme: p.theme === 'light' ? 'light' : 'dark',
      reducedMotion: typeof p.reducedMotion === 'boolean' ? p.reducedMotion : true,
      explanations: p.explanations === 'on-request' ? 'on-request' : 'always',
    };
  } catch { return { ...defaultPreferences }; }
}
