import type { SkillId, StudentProgress } from "../types/progress";
export interface Attempt {
  skill: SkillId;
  correct: boolean;
  independent: boolean;
  stepKey: string;
  misconception?: string;
  evidenceKey?: string;
}
export function recordProgressAttempt(
  p: StudentProgress,
  a: Attempt,
): StudentProgress {
  const s = p.skills[a.skill];
  const award = a.correct && !p.awardedSteps.includes(a.stepKey);
  // A saved first-answer result prevents a refresh or retry from rewriting evidence.
  const independent =
    a.independent && (!a.evidenceKey || !p.practiceEvidence[a.evidenceKey]);
  return {
    ...p,
    skills: {
      ...p.skills,
      [a.skill]: {
        attempts: s.attempts + 1,
        correct: s.correct + Number(a.correct),
        independentAttempts: s.independentAttempts + Number(independent),
        independentCorrect:
          s.independentCorrect + Number(independent && a.correct),
      },
    },
    xp: p.xp + (award ? 10 : 0),
    awardedSteps: award ? [...p.awardedSteps, a.stepKey] : p.awardedSteps,
    misconceptions: a.misconception
      ? {
          ...p.misconceptions,
          [a.misconception]: (p.misconceptions[a.misconception] ?? 0) + 1,
        }
      : p.misconceptions,
    practiceEvidence:
      independent && a.evidenceKey
        ? {
            ...p.practiceEvidence,
            [a.evidenceKey]: a.correct ? "correct" : "incorrect",
          }
        : p.practiceEvidence,
  };
}
export function markProgressAssisted(
  p: StudentProgress,
  evidenceKey: string,
): StudentProgress {
  return {
    ...p,
    practiceEvidence: p.practiceEvidence[evidenceKey]
      ? p.practiceEvidence
      : { ...p.practiceEvidence, [evidenceKey]: "assisted" },
  };
}
