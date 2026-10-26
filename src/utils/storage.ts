import { skillIds, type StudentProgress } from "../types/progress";
export const STORAGE_KEY = "algebra-lab.chapter4.progress.v1";
export function emptyProgress(): StudentProgress {
  return {
    version: 1,
    skills: Object.fromEntries(
      skillIds.map((id) => [
        id,
        {
          attempts: 0,
          correct: 0,
          independentAttempts: 0,
          independentCorrect: 0,
        },
      ]),
    ) as StudentProgress["skills"],
    completedLessons: [],
    lessonPositions: {},
    awardedSteps: [],
    misconceptions: {},
    practiceEvidence: {},
    xp: 0,
  };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function count(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}
export function parseProgress(raw: string | null): StudentProgress {
  if (!raw) return emptyProgress();
  try {
    const p: unknown = JSON.parse(raw);
    if (
      !isRecord(p) ||
      p.version !== 1 ||
      !isRecord(p.skills) ||
      !count(p.xp) ||
      !strings(p.completedLessons) ||
      !strings(p.awardedSteps) ||
      !isRecord(p.lessonPositions) ||
      !isRecord(p.misconceptions)
    )
      return emptyProgress();
    const skills = p.skills;
    if (
      !skillIds.every((id) => {
        const s = skills[id];
        return (
          isRecord(s) &&
          count(s.attempts) &&
          count(s.correct) &&
          count(s.independentAttempts) &&
          count(s.independentCorrect) &&
          s.correct <= s.attempts &&
          s.independentAttempts <= s.attempts &&
          s.independentCorrect <= s.independentAttempts &&
          s.independentCorrect <= s.correct
        );
      })
    )
      return emptyProgress();
    if (
      ![
        ...Object.values(p.lessonPositions),
        ...Object.values(p.misconceptions),
      ].every(count)
    )
      return emptyProgress();
    const evidence = p.practiceEvidence ?? {};
    if (
      !isRecord(evidence) ||
      !Object.values(evidence).every(
        (value) =>
          value === "correct" || value === "incorrect" || value === "assisted",
      )
    )
      return emptyProgress();
    // Older v1 saves lack round evidence; retain all existing progress.
    return { ...p, practiceEvidence: evidence } as unknown as StudentProgress;
  } catch {
    return emptyProgress();
  }
}
