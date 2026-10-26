import type {
  GraphSpec,
  Point,
  PracticeProblem,
  ProblemStep,
} from "../../types/practice";
import { skillIds, type SkillId } from "../../types/progress";
import { equation, formatNumber } from "../../utils/linear";
export const practiceSkills = skillIds;
export type PracticeSkill = SkillId;
export interface EquationCase {
  id: string;
  skill: SkillId;
  slope: number;
  intercept: number;
  inputs?: number[];
}
export const equationCases: EquationCase[] = [
  ...[
    [-2, 3],
    [3, -2],
    [0.5, 1],
    [-1.5, -3],
    [1, 0.5],
    [-1, 4],
  ].map(([slope, intercept], i) => ({
    id: "given-" + i,
    skill: "equation-from-information" as const,
    slope,
    intercept,
  })),
  ...[
    [1, -2],
    [-1, 3],
    [0.5, -1],
    [-0.5, 2],
    [2, -3],
    [-2, 4],
  ].map(([slope, intercept], i) => ({
    id: "graph-" + i,
    skill: "equation-from-graph" as const,
    slope,
    intercept,
  })),
  ...[
    [2, 1],
    [-1, 2],
    [0.5, -2],
    [-2, -1],
    [1, 0.5],
    [-0.5, 3],
  ].map(([slope, intercept], i) => ({
    id: "table-" + i,
    skill: "equation-from-table" as const,
    slope,
    intercept,
    inputs: [-2, 0, 2, 4],
  })),
  ...[-3, 2, 0, 1.5, -2.5, 4].map((intercept, i) => ({
    id: "horizontal-" + i,
    skill: "horizontal-equations" as const,
    slope: 0,
    intercept,
  })),
];
export function graphFor(
  c: Pick<EquationCase, "slope" | "intercept">,
): GraphSpec {
  const run = Number.isInteger(c.slope) ? 1 : 2;
  const points = [
    { x: 0, y: c.intercept },
    { x: run, y: c.slope * run + c.intercept },
  ];
  return {
    model: { kind: "line", slope: c.slope, intercept: c.intercept },
    points,
    description: `A straight line through (0, ${String(points[0].y).replace("-", "−")}) and (${run}, ${String(points[1].y).replace("-", "−")}). Both axes use one unit per labeled tick.`,
  };
}
export function tableFor(c: EquationCase): Point[] {
  return (c.inputs ?? [-2, 0, 2, 4]).map((x) => ({
    x,
    y: c.slope * x + c.intercept,
  }));
}
export function question(
  id: string,
  skill: SkillId,
  expression: string,
  prompt: string,
  answer: string,
  explanation: string,
  wrong: [string, string][],
  hints: string[],
  graph?: GraphSpec,
  table?: Point[],
): PracticeProblem {
  const choices = [
    { id: "correct", label: answer },
    ...wrong.map(([label, feedback], i) => ({
      id: "error" + i,
      label,
      misconception: { id: skill + ":" + id + ":error" + i, feedback },
    })),
  ];
  const offset =
    Array.from(id).reduce((sum, c) => sum + c.charCodeAt(0), 0) %
    choices.length;
  const step: ProblemStep = {
    id: "check",
    skill,
    expression,
    prompt,
    answer: "correct",
    explanation,
    choices: [...choices.slice(offset), ...choices.slice(0, offset)],
    hints: hints.map((text) => ({ text })),
    graph,
    table,
  };
  return {
    id,
    topicId: skill,
    prompt: "One decision at a time. Help is always available.",
    problemType: "equation",
    difficulty: "introductory",
    mode: "independent",
    answer,
    explanation,
    steps: [step],
    workedSolution: [expression, ...hints, explanation],
  };
}
function equationProblem(c: EquationCase): PracticeProblem {
  const answer = equation(c.slope, c.intercept);
  const m = formatNumber(c.slope),
    b = String(c.intercept).replace("-", "−");
  const horizontal = c.slope === 0;
  const display =
    c.skill === "equation-from-graph"
      ? "Use the two marked graph points"
      : c.skill === "equation-from-table"
        ? "Use the input/output table"
        : horizontal
          ? `Slope m = 0; y-intercept b = ${b}`
          : `Slope m = ${m}; y-intercept b = ${b}`;
  const operation =
    c.skill === "equation-from-table"
      ? "Read b from the row x = 0. Calculate m = change in y / change in x."
      : c.skill === "equation-from-graph"
        ? "Read b where x = 0. Use signed rise / run for m."
        : "Put the slope in front of x and the signed intercept at the end.";
  const explanation = horizontal
    ? `m = 0, b = ${b}. Then y = 0x ${c.intercept < 0 ? "− " + formatNumber(-c.intercept) : "+ " + b} simplifies to ${answer}. Every point has the same y-value.`
    : `m = ${m} and b = ${b}. Substitute into y = mx + b: ${answer}. Check x = 0: the output must be ${b}.`;
  const wrong: [string, string][] = horizontal
    ? [
        [
          equation(1, c.intercept),
          "A horizontal line has no rise. The coefficient of x must be zero, not one.",
        ],
        [
          c.intercept === 0 ? "x = 0" : `x = ${b}`,
          "That is a vertical line. Constant output is written y = a number; constant input is x = a number.",
        ],
      ]
    : [
        [
          equation(-c.slope, c.intercept),
          c.skill === "equation-from-information"
            ? "Keep the sign attached to the given slope. The coefficient of x must match m."
            : "Follow the line or table as x increases. Use signed y-change over signed x-change; check the direction.",
        ],
        [
          equation(c.slope, c.intercept === 0 ? 1 : -c.intercept),
          "Check the output when x = 0. That value—not the slope—belongs at the end, with its sign.",
        ],
      ];
  return question(
    c.id,
    c.skill,
    display,
    "Which equation represents this line?",
    answer,
    explanation,
    wrong,
    [
      operation,
      horizontal
        ? "0 multiplied by x is always 0. Keep only the constant output."
        : `Read the slope and intercept separately. Use y = (${m})x + (${b}), then simplify the signs.`,
    ],
    c.skill === "equation-from-graph" ? graphFor(c) : undefined,
    c.skill === "equation-from-table" ? tableFor(c) : undefined,
  );
}
const q = question;
export const independentProblems: PracticeProblem[] = [
  q(
    "identify-slope-positive",
    "identify-m-and-b",
    "y = 3x − 2",
    "Which number is the slope m?",
    "3",
    "m is the signed coefficient multiplying x.",
    [
      ["−2", "−2 is the constant term b. Look for the number attached to x."],
      ["−3", "The negative sign belongs to the constant −2, not to 3x."],
    ],
    ["Compare with y = mx + b.", "Find the coefficient of x."],
  ),
  q(
    "identify-intercept-negative",
    "identify-m-and-b",
    "y = −2x − 4",
    "What is b?",
    "−4",
    "The constant term includes its sign. The line crosses the y-axis at (0, −4).",
    [
      ["4", "The minus sign is part of the intercept."],
      ["−2", "−2 is multiplying x, so it is the slope."],
    ],
    ["Look for the term without x.", "Keep its sign."],
  ),
  q(
    "identify-implicit-one",
    "identify-m-and-b",
    "y = x + 2",
    "What is m?",
    "1",
    "x means 1x. The unwritten coefficient is one.",
    [
      ["0", "Zero times x disappears entirely; here an x-term remains."],
      ["2", "2 is the intercept b."],
    ],
    ["Rewrite x as 1x.", "Read the coefficient of x."],
  ),
  q(
    "identify-fraction",
    "identify-m-and-b",
    "y = (−1/2)x + 3",
    "What is m?",
    "−1/2",
    "The whole signed fraction multiplies x.",
    [
      ["1/2", "Keep the negative sign with the coefficient."],
      ["3", "3 is the constant, not the x-coefficient."],
    ],
    ["Find the entire coefficient of x.", "Include the fraction and its sign."],
  ),
  q(
    "identify-zero-row",
    "identify-m-and-b",
    "A point on a line is (0, −1.5).",
    "Which y-intercept value b does it give?",
    "−1.5",
    "At x = 0, y = b, so use the output −1.5.",
    [
      ["0", "Zero is the x-coordinate. b is the output at that input."],
      ["1.5", "Preserve the negative sign of the output."],
    ],
    ["A y-intercept is a point with x = 0.", "Read that point’s y-coordinate."],
  ),
  q(
    "identify-intercept-positive",
    "identify-m-and-b",
    "y = −3x + 0.5",
    "What is the y-intercept as a point?",
    "(0, 0.5)",
    "At x = 0, the x-term is zero and y = 0.5.",
    [
      ["(0.5, 0)", "That point is on the x-axis. The y-intercept has x = 0."],
      ["(0, −3)", "−3 is the slope, not the starting output."],
    ],
    ["Set x to zero.", "Write the point as (0, b)."],
  ),
  ...equationCases.map(equationProblem),
];
export const independentProblemMap: Record<string, PracticeProblem> =
  Object.fromEntries(independentProblems.map((p) => [p.id, p]));
