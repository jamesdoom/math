import {
  independentProblems,
  independentProblemMap,
  practiceSkills,
  type PracticeSkill,
} from "../data/chapters/chapter4Practice";
import type { StudentProgress } from "../types/progress";
export type PracticeSelection = PracticeSkill | "mixed";
export interface PracticeRound {
  version: 1;
  id: string;
  selection: PracticeSelection;
  problemIds: string[];
  index: number;
}
export const ROUND_STORAGE_KEY = "algebra-lab.chapter4.practice-round.v1";
function shuffle<T>(values: T[], random: () => number): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function createRound(
  selection: PracticeSelection,
  evidence: StudentProgress["practiceEvidence"],
  id: string,
  random: () => number = Math.random,
): PracticeRound {
  const counts = (problemId: string) =>
    Object.entries(evidence).filter(
      ([key, value]) =>
        key.endsWith(`:${problemId}:check`) && value !== "assisted",
    ).length;
  const chosen = (selection === "mixed" ? practiceSkills : [selection]).flatMap(
    (skill) =>
      shuffle(
        independentProblems.filter((p) => p.steps[0].skill === skill),
        random,
      )
        .sort((a, b) => counts(a.id) - counts(b.id))
        .slice(0, selection === "mixed" ? 1 : 3),
  );
  return {
    version: 1,
    id,
    selection,
    problemIds: shuffle(chosen, random).map((p) => p.id),
    index: 0,
  };
}
export function parseRound(raw: string | null): PracticeRound | null {
  if (!raw) return null;
  try {
    const round: unknown = JSON.parse(raw);
    if (typeof round !== "object" || round === null) return null;
    const p = round as Record<string, unknown>;
    if (
      p.version !== 1 ||
      typeof p.id !== "string" ||
      !p.id ||
      !(
        p.selection === "mixed" ||
        practiceSkills.some((skill) => skill === p.selection)
      ) ||
      !Array.isArray(p.problemIds) ||
      p.problemIds.length !==
        (p.selection === "mixed" ? practiceSkills.length : 3) ||
      !p.problemIds.every(
        (id) =>
          typeof id === "string" && Object.hasOwn(independentProblemMap, id),
      ) ||
      new Set(p.problemIds).size !== p.problemIds.length ||
      typeof p.index !== "number" ||
      !Number.isInteger(p.index) ||
      p.index < 0 ||
      p.index > p.problemIds.length
    )
      return null;
    if (
      p.selection !== "mixed" &&
      p.problemIds.some(
        (id) => independentProblemMap[id].steps[0].skill !== p.selection,
      )
    )
      return null;
    const problemIds: string[] = p.problemIds;
    if (
      p.selection === "mixed" &&
      !practiceSkills.every(
        (skill) =>
          problemIds.filter(
            (id) => independentProblemMap[id].steps[0].skill === skill,
          ).length === 1,
      )
    )
      return null;
    return p as unknown as PracticeRound;
  } catch {
    return null;
  }
}
