export const skillIds = [
  "coordinates-tables",
  "linear-graphs",
  "domain-range-intercepts",
  "slope-graphs",
  "slope-points-tables",
  "slope-intercept-form",
  "linear-models",
] as const;
export type SkillId = (typeof skillIds)[number];
export type MasteryState =
  "NOT_STARTED" | "LEARNING" | "PRACTICING" | "MASTERED";
export interface SkillProgress {
  attempts: number;
  correct: number;
  independentAttempts: number;
  independentCorrect: number;
}
export interface StudentProgress {
  version: 1;
  skills: Record<SkillId, SkillProgress>;
  completedLessons: string[];
  lessonPositions: Record<string, number>;
  awardedSteps: string[];
  misconceptions: Record<string, number>;
  practiceEvidence: Record<string, "correct" | "incorrect" | "assisted">;
  xp: number;
}
