import type { Chapter, Lesson } from "../../types/curriculum";
import type { GraphSpec, Point, PracticeProblem } from "../../types/practice";
import type { SkillId } from "../../types/progress";
import {
  independentProblemMap,
  independentProblems,
  question,
  graphFor,
} from "./chapter4Practice";
export const source =
  "Ch 4. Page 1 notes.pdf · 4.1 Writing Equations in Slope-Intercept Form";
function guided(
  id: string,
  cases: Parameters<typeof question>[],
): PracticeProblem {
  const parts = cases.map((args) => question(...args));
  return {
    ...parts[0],
    id,
    mode: "guided",
    steps: parts.map((p, i) => ({ ...p.steps[0], id: "step" + i })),
    answer: parts.at(-1)!.answer,
    workedSolution: parts.map((p) => p.explanation),
  };
}
const infoGraph = graphFor({ slope: -1, intercept: 2 });
const tablePoints = [
  { x: -2, y: 5 },
  { x: 0, y: 1 },
  { x: 2, y: -3 },
  { x: 4, y: -7 },
];
export const guidedProblems: PracticeProblem[] = [
  guided("c4-guided-parts", [
    [
      "parts-m",
      "identify-m-and-b",
      "y = −2x + 3",
      "First: which number is multiplying x?",
      "−2",
      "The slope m is −2. Keep its sign.",
      [
        ["2", "The negative sign belongs to the x-coefficient."],
        ["3", "3 is added after the x-term; it is b."],
      ],
      ["Match the x-term with mx.", "Read the entire signed coefficient."],
    ],
    [
      "parts-b",
      "identify-m-and-b",
      "y = −2x + 3",
      "Now: which number is b?",
      "3",
      "The constant term is +3. At x = 0, y = 3.",
      [
        ["−2", "We already identified −2 as m."],
        [
          "0",
          "Zero is the input used to locate the y-intercept, not its output.",
        ],
      ],
      ["Look for the term without x.", "Read the value after the x-term."],
    ],
  ]),
  guided("c4-guided-given", [
    [
      "given-slot",
      "equation-from-information",
      "Slope = −1; y-intercept = 0.5",
      "Put just m into y = mx + b.",
      "y = (−1)x + b",
      "The given slope goes in the coefficient slot.",
      [
        ["y = 0.5x + b", "0.5 is the intercept. Put −1 in the m slot."],
        ["y = x + b", "Do not drop the negative sign on m."],
      ],
      ["Locate the m slot beside x.", "Use the whole signed slope."],
    ],
    [
      "given-fill",
      "equation-from-information",
      "y = (−1)x + b; b = 0.5",
      "Now replace b.",
      "y = (−1)x + 0.5",
      "Keep m where it is and replace only b.",
      [
        ["y = (−1)x − 0.5", "The intercept is positive."],
        ["y = 0.5x − 1", "Do not swap the two roles."],
      ],
      ["b is the constant term.", "Insert +0.5 at the end."],
    ],
    [
      "given-simplify",
      "equation-from-information",
      "y = (−1)x + 0.5",
      "Write −1x more simply.",
      "y = −x + 0.5",
      "−1x and −x mean the same thing.",
      [
        ["y = x + 0.5", "The coefficient −1 includes a minus sign."],
        [
          "y = −0.5x",
          "The intercept is added; it does not combine with an x-term.",
        ],
      ],
      ["One copy of negative x is written −x.", "Keep the intercept separate."],
    ],
    [
      "given-check",
      "equation-from-information",
      "Check y = −x + 0.5 at x = 0.",
      "What output should we get?",
      "0.5",
      "y = −0 + 0.5 = 0.5. This matches the given intercept.",
      [
        ["−1", "−1 is the slope, not the output at x = 0."],
        ["0", "The x-term vanishes, but the intercept remains."],
      ],
      ["Replace x with zero.", "Only the constant term remains."],
    ],
  ]),
  guided("c4-guided-graph", [
    [
      "graph-b",
      "equation-from-graph",
      "Read the marked point on the y-axis.",
      "What is b?",
      "2",
      "The graph crosses the y-axis at (0, 2). So b = 2.",
      [
        ["0", "Read the y-coordinate, not the x-coordinate."],
        ["−1", "Find the y-axis crossing before calculating slope."],
      ],
      ["Find the point with x = 0.", "Read its height."],
      infoGraph,
    ],
    [
      "graph-rise",
      "equation-from-graph",
      "Move from (0, 2) to (1, 1).",
      "What is the signed rise?",
      "−1",
      "The output changes from 2 to 1: 1 − 2 = −1.",
      [
        ["1", "Moving down gives a negative rise."],
        ["2", "2 is the initial height, not the change in height."],
      ],
      ["Compare the two y-values.", "Subtract starting y from ending y."],
      infoGraph,
    ],
    [
      "graph-rate",
      "equation-from-graph",
      "Rise = −1; run = 1",
      "What is m = rise / run?",
      "−1",
      "m = −1/1 = −1.",
      [
        ["1", "Keep the negative rise."],
        ["0", "A falling line is not horizontal."],
      ],
      [
        "Divide rise by run.",
        "A negative divided by a positive stays negative.",
      ],
    ],
    [
      "graph-write",
      "equation-from-graph",
      "m = −1; b = 2",
      "Put the two pieces together.",
      "y = −x + 2",
      "Write the slope next to x and the intercept at the end.",
      [
        ["y = x + 2", "The slope is negative."],
        ["y = 2x − 1", "Keep slope and intercept in their own slots."],
      ],
      ["Use y = mx + b.", "Use −1 for m and 2 for b."],
    ],
  ]),
  guided("c4-guided-table", [
    [
      "table-b",
      "equation-from-table",
      "Read the table.",
      "Which output is paired with input x = 0?",
      "1",
      "The row x = 0 gives y = 1, so b = 1.",
      [
        ["0", "Zero is the input. Read the output in that row."],
        ["5", "5 belongs to input −2, not zero."],
      ],
      ["Find x = 0.", "Read across that row."],
      undefined,
      tablePoints,
    ],
    [
      "table-dy",
      "equation-from-table",
      "Use (0, 1) and (2, −3).",
      "What is the change in y?",
      "−4",
      "Ending y minus starting y: −3 − 1 = −4.",
      [
        ["4", "Keep the direction of the change: the output decreased."],
        ["2", "2 is the change in x."],
      ],
      ["Compare the outputs in the same point order.", "Calculate −3 − 1."],
    ],
    [
      "table-dx",
      "equation-from-table",
      "Use (0, 1) and (2, −3).",
      "What is the change in x, in that same order?",
      "2",
      "Ending x minus starting x: 2 − 0 = 2.",
      [
        ["−2", "Use ending minus starting, as in the y-change."],
        ["−4", "−4 was the output change."],
      ],
      ["Compare the inputs.", "Calculate 2 − 0."],
    ],
    [
      "table-m",
      "equation-from-table",
      "m = (change in y)/(change in x) = −4/2",
      "Simplify the slope.",
      "−2",
      "−4 divided by 2 is −2.",
      [
        [
          "−4",
          "Divide by the input change; do not use only the output change.",
        ],
        ["2", "A negative divided by a positive is negative."],
      ],
      ["Divide numerator by denominator.", "Keep the negative sign."],
    ],
    [
      "table-write",
      "equation-from-table",
      "m = −2; b = 1",
      "Write the full equation.",
      "y = −2x + 1",
      "Substitute both values into y = mx + b. At x = 2, it predicts −3, matching the table.",
      [
        ["y = x − 2", "Do not swap m and b."],
        [
          "y = 2x + 1",
          "The table decreases as x increases, so the slope is negative.",
        ],
      ],
      ["Put −2 beside x.", "Add the intercept +1."],
    ],
  ]),
  guided("c4-guided-horizontal", [
    [
      "horizontal-rise",
      "horizontal-equations",
      "Outputs: −1.5, −1.5, −1.5",
      "What is the change in y?",
      "0",
      "The output stays the same, so there is zero rise.",
      [
        ["−1.5", "That is the output itself, not a change between outputs."],
        ["1", "The output does not increase."],
      ],
      ["Subtract one output from the next.", "−1.5 − (−1.5) = 0."],
    ],
    [
      "horizontal-slope",
      "horizontal-equations",
      "Rise = 0; run = 2",
      "What is the slope?",
      "0",
      "0 / 2 = 0. A horizontal line has zero slope.",
      [
        ["Undefined", "The denominator is 2, not zero."],
        ["2", "The run alone is not the slope."],
      ],
      ["Use rise divided by run.", "Zero divided by a nonzero number is zero."],
    ],
    [
      "horizontal-fill",
      "horizontal-equations",
      "m = 0; b = −1.5",
      "Insert the values into y = mx + b.",
      "y = 0x − 1.5",
      "The x-term has coefficient zero.",
      [
        ["y = x − 1.5", "An unwritten coefficient of x is one, not zero."],
        ["y = −1.5x", "−1.5 is the constant output, not the slope."],
      ],
      ["Put zero in the m slot.", "Keep the signed constant −1.5."],
    ],
    [
      "horizontal-final",
      "horizontal-equations",
      "y = 0x − 1.5",
      "Since 0x is zero, what remains?",
      "y = −1.5",
      "Every input gives output −1.5. This is a horizontal line.",
      [
        ["x = −1.5", "The constant value belongs to y, not x."],
        ["y = 0", "The x-term disappears; the constant does not."],
      ],
      ["Remove only the zero term.", "Keep −1.5 as the output."],
    ],
  ]),
];
interface Content {
  id: string;
  title: string;
  skill: SkillId;
  body: string;
  example: string[];
  graph: GraphSpec;
  table?: Point[];
  guidedId: string;
  support: string[];
}
function lesson(c: Content): Lesson {
  return {
    id: c.id,
    title: c.title,
    description: c.body,
    skills: [c.skill],
    source,
    support: c.support,
    steps: [
      {
        id: "understand",
        type: "explanation",
        title: "One idea first",
        body: c.body,
      },
      {
        id: "example",
        type: "example",
        title: "An example in small steps",
        body: "Reveal one move at a time. Read why it works before moving on.",
        lines: c.example,
        graph: c.graph,
        table: c.table,
        revealOneAtATime: true,
      },
      {
        id: "guided",
        type: "guided-practice",
        title: "Build it with help",
        body: "You do not have to solve everything at once. Start with one small decision.",
        problemIds: [c.guidedId],
      },
      {
        id: "check",
        type: "checkpoint",
        title: "Try a few yourself",
        body: "Three short checks. Help is available, and mistakes lead to an explanation.",
        problemIds: independentProblems
          .filter((p) => p.steps[0].skill === c.skill)
          .slice(0, 3)
          .map((p) => p.id),
      },
    ],
  };
}
const horizontalGraph = graphFor({ slope: 0, intercept: -1.5 });
export const lessons: Lesson[] = [
  lesson({
    id: "c4-find-m-and-b",
    title: "Find the two building blocks",
    skill: "identify-m-and-b",
    body: "In y = mx + b, m is the slope: it multiplies x. b is the y-intercept value: it is the output when x = 0. Keep the sign with each number.",
    example: [
      "Start with y = −x + 2.",
      "The x-term is −1x, so m = −1.",
      "The constant is +2, so b = 2. At x = 0, the point is (0, 2).",
    ],
    graph: infoGraph,
    guidedId: "c4-guided-parts",
    support: [
      "Think of two slots: a number beside x, and a number added at the end.",
      "For y = 3x − 2, 3 goes with x. The intercept is −2.",
      "m = 3 and b = −2. Setting x = 0 leaves y = −2, so the crossing is (0, −2).",
    ],
  }),
  lesson({
    id: "c4-write-given",
    title: "Write an equation from m and b",
    skill: "equation-from-information",
    body: "Use the given slope and intercept to fill y = mx + b. First put in m. Then put in b. Finally simplify signs and check the output at x = 0.",
    example: [
      "Given slope −2 and y-intercept 0.5, start with y = mx + b.",
      "Replace only m: y = (−2)x + b.",
      "Replace b: y = −2x + 0.5.",
      "Check x = 0: y = 0.5, matching the intercept.",
    ],
    graph: graphFor({ slope: -2, intercept: 0.5 }),
    guidedId: "c4-guided-given",
    support: [
      "You are filling two slots, not inventing a new rule.",
      "If m = 2 and b = −3, put 2 before x and −3 at the end.",
      "y = (2)x + (−3) becomes y = 2x − 3. At x = 0, its output is −3.",
    ],
  }),
  lesson({
    id: "c4-write-graph",
    title: "Write an equation from a graph",
    skill: "equation-from-graph",
    body: "Find the y-axis crossing first for b. Use two clear points to find signed rise over run for m. Only then put the values into y = mx + b.",
    example: [
      "The marked points are (0, −1) and (2, 0).",
      "The y-axis crossing gives b = −1.",
      "From the first point to the second: rise = 1 and run = 2, so m = 1/2.",
      "Use both pieces: y = (1/2)x − 1.",
    ],
    graph: { ...graphFor({ slope: 0.5, intercept: -1 }), slopeTriangle: true },
    guidedId: "c4-guided-graph",
    support: [
      "First ask where the line crosses the vertical axis. Then ask how it changes.",
      "For points (0, 3) and (2, 2), b = 3. Moving right 2 drops y by 1.",
      "m = −1/2, so the equation is y = (−1/2)x + 3. The negative sign tells us the line falls.",
    ],
  }),
  lesson({
    id: "c4-write-table",
    title: "Write an equation from a table",
    skill: "equation-from-table",
    body: "Find the row where x = 0 to read b. Choose two rows and calculate the changes in y and x in the same order. Divide to get m, then write the equation.",
    example: [
      "Use rows (−2, −3), (0, 1), and (2, 5).",
      "The row x = 0 gives b = 1.",
      "From (0, 1) to (2, 5): change in y = 4; change in x = 2. So m = 4/2 = 2.",
      "The equation is y = 2x + 1. Check (2, 5): 2(2) + 1 = 5.",
    ],
    table: [
      { x: -2, y: -3 },
      { x: 0, y: 1 },
      { x: 2, y: 5 },
    ],
    graph: graphFor({ slope: 2, intercept: 1 }),
    guidedId: "c4-guided-table",
    support: [
      "Read the intercept from one row; calculate the slope from two rows.",
      "If x changes 0 to 2 while y changes 1 to 5, the rate is (5 − 1)/(2 − 0).",
      "The rate is 2, not 4. The zero-input row gives b = 1. Write y = 2x + 1.",
    ],
  }),
  lesson({
    id: "c4-horizontal",
    title: "When the slope is zero",
    skill: "horizontal-equations",
    body: "If every y-value is the same, the line has no rise. Its slope is zero. In y = 0x + b the 0x term disappears, leaving y = b.",
    example: [
      "A table has inputs 0, 2, 4 and outputs −1.5, −1.5, −1.5.",
      "The output change is 0 while the input changes, so m = 0.",
      "The zero-input row gives b = −1.5. Write y = 0x − 1.5.",
      "Simplify to y = −1.5. Every point stays at that height.",
    ],
    table: [
      { x: 0, y: -1.5 },
      { x: 2, y: -1.5 },
      { x: 4, y: -1.5 },
    ],
    graph: horizontalGraph,
    guidedId: "c4-guided-horizontal",
    support: [
      "The output never changes, so the line stays flat.",
      "If y is always 2.5, the slope is 0 and the intercept is 2.5.",
      "y = 0x + 2.5 simplifies to y = 2.5. It is the output y that stays fixed.",
    ],
  }),
];
export const problems: Record<string, PracticeProblem> = {
  ...independentProblemMap,
  ...Object.fromEntries(guidedProblems.map((p) => [p.id, p])),
};
export const chapter4: Chapter = {
  id: "chapter-4",
  number: 4,
  title: "Writing Linear Equations",
  description: "Section 4.1 · Slope-intercept form · supplied page 1 only",
  topics: lessons.map((l) => ({
    id: l.skills[0],
    title: l.title,
    description: l.description,
    objectives: [
      "Find one piece at a time",
      "Build with guidance",
      "Try three short checks",
    ],
    lessons: [l],
  })),
};
