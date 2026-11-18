import {
  skillIds,
  type SkillProgress,
  type StudentProgress,
  type MasteryState,
} from "../types/progress";
export const skillLabels: Record<(typeof skillIds)[number], string> = {
  'system-solutions': 'Check a pair in both equations',
  'graphing-systems': 'Solve systems by graphing',
  'solution-count': 'One, no, or infinitely many solutions',
  'elimination-add-subtract': 'Add or subtract to eliminate',
  'elimination-scaling': 'Scale whole equations',
  'back-substitution': 'Find the other variable and check',
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
