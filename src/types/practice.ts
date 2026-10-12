import type { SkillId } from "./progress";
export interface Point {
  x: number;
  y: number;
}
export type GraphModel =
  | { kind: "line"; slope: number; intercept: number }
  | { kind: "vertical"; x: number }
  | { kind: "points"; points: Point[] };
export interface GraphSpec {
  slopeTriangle?: boolean;
  model: GraphModel;
  description: string;
  points?: Point[];
  bounds?: { xMin: number; xMax: number; yMin: number; yMax: number };
  xLabel?: string;
  yLabel?: string;
}
export interface Hint {
  text: string;
}
export interface Misconception {
  id: string;
  feedback: string;
}
export interface Choice {
  id: string;
  label: string;
  misconception?: Misconception;
}
export interface ProblemStep {
  id: string;
  prompt: string;
  expression: string;
  skill: SkillId;
  choices: Choice[];
  answer: string;
  explanation: string;
  hints: Hint[];
  graph?: GraphSpec;
  table?: Point[];
}
export interface PracticeProblem {
  id: string;
  topicId: string;
  prompt: string;
  problemType:
    "evaluation" | "graph" | "features" | "slope" | "equation" | "model";
  difficulty: "introductory" | "standard";
  mode: "guided" | "independent";
  steps: ProblemStep[];
  answer: string;
  explanation: string;
  workedSolution: string[];
  solutionGraph?: GraphSpec;
}
