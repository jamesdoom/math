import {
  skillIds,
  type SkillProgress,
  type StudentProgress,
  type MasteryState,
} from "../types/progress";
export const skillLabels: Record<(typeof skillIds)[number], string> = {
  "identify-m-and-b": "Identify m and b",
  "equation-from-information": "Write from given m and b",
  "equation-from-graph": "Write from a graph",
  "equation-from-table": "Write from a table",
  "horizontal-equations": "Horizontal line equations",
};
export function mastery(p: SkillProgress) {
  return p.independentAttempts
    ? Math.round((100 * p.independentCorrect) / p.independentAttempts)
    : 0;
}
export function masteryState(p: SkillProgress): MasteryState {
  if (!p.attempts) return "NOT_STARTED";
  if (!p.independentAttempts) return "LEARNING";
  return p.independentCorrect >= 3 && mastery(p) >= 80
    ? "MASTERED"
    : "PRACTICING";
}
export function overallMastery(p: StudentProgress) {
  return Math.round(
    skillIds.reduce((sum, id) => sum + mastery(p.skills[id]), 0) /
      skillIds.length,
  );
}
