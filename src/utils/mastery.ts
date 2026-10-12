import {
  skillIds,
  type SkillProgress,
  type StudentProgress,
  type MasteryState,
} from "../types/progress";
export const skillLabels: Record<(typeof skillIds)[number], string> = {
  "coordinates-tables": "Inputs and coordinates",
  "linear-graphs": "Tables and graphs",
  "domain-range-intercepts": "Domain, range, intercepts",
  "slope-graphs": "Slope on graphs",
  "slope-points-tables": "Slope from points and tables",
  "slope-intercept-form": "Slope-intercept form",
  "linear-models": "Real-world models",
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
