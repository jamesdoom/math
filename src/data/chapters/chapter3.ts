import type { Chapter, Lesson } from "../../types/curriculum";
import type { GraphSpec, Point, PracticeProblem } from "../../types/practice";
import type { SkillId } from "../../types/progress";
import {
  independentProblems,
  independentProblemMap,
  question,
  line,
} from "./chapter3Practice";
function guided(
  id: string,
  skill: SkillId,
  cases: Parameters<typeof question>[],
): PracticeProblem {
  const parts = cases.map((args) => question(...args));
  return {
    ...parts[0],
    id,
    mode: "guided",
    topicId: skill,
    steps: parts.map((p, i) => ({ ...p.steps[0], id: "step" + i })),
    answer: parts.at(-1)!.answer,
    workedSolution: parts.flatMap((p) => [
      p.steps[0].expression,
      p.explanation,
    ]),
  };
}
const g = guided;
export const guidedProblems: PracticeProblem[] = [
  g("guided-pattern", "linear-graphs", [
    [
      "g-pattern-rate",
      "linear-graphs",
      "Table: (−2, −3), (0, 1), (2, 5)",
      "When x increases by 2, y increases by 4. What is the rate per unit x?",
      "2",
      "The rate is 4 / 2 = 2, not simply the change in output.",
      [
        [
          "4",
          "4 is the output change over two input units. Divide by the input change.",
        ],
        ["1/2", "Use output change over input change."],
      ],
      ["Compare both changes.", "Divide 4 by 2."],
    ],
    [
      "g-pattern-next",
      "linear-graphs",
      "Rule y = 2x + 1",
      "What output belongs to input x = 4?",
      "9",
      "2(4) + 1 = 9. A further input increase of 2 raises the output from 5 to 9.",
      [
        [
          "7",
          "Each input unit changes output by 2. Increasing x from 2 to 4 changes y by 4.",
        ],
        ["8", "Include the starting output 1 as well as the rate term."],
      ],
      ["Multiply the new input by the rate.", "Add the output at zero."],
    ],
  ]),
  g("guided-input", "coordinates-tables", [
    [
      "g-input-sub",
      "coordinates-tables",
      "y = 2x + 3; x = −1",
      "What should we substitute?",
      "2(−1) + 3",
      "Replace x with −1; keep the entire input in parentheses.",
      [
        ["2(1) + 3", "Keep the negative sign from the input."],
        ["−1 + 3", "The input is multiplied by 2 first."],
      ],
      ["Replace only x.", "Keep the coefficient 2."],
    ],
    [
      "g-input-result",
      "coordinates-tables",
      "y = 2(−1) + 3",
      "After multiplying, what is y?",
      "1",
      "2(−1) = −2. Then −2 + 3 = 1. The point is (−1, 1).",
      [
        ["−5", "Add +3 rather than subtract 3."],
        ["5", "The product 2(−1) is negative."],
      ],
      ["Multiply before adding.", "−2 + 3 moves three units right from −2."],
    ],
  ]),
  g("guided-graph", "linear-graphs", [
    [
      "g-graph-first",
      "linear-graphs",
      "y = −x + 2; x = 0",
      "Which point do we plot first?",
      "(0, 2)",
      "At x = 0 the output is 2. Plot x horizontally and y vertically.",
      [
        ["(2, 0)", "Use the input first: (x, y)."],
        ["(0, −2)", "The constant term is +2."],
      ],
      ["Substitute 0.", "Write (input, output)."],
    ],
    [
      "g-graph-next",
      "linear-graphs",
      "y = −x + 2; x = 2",
      "Which point comes next?",
      "(2, 0)",
      "−2 + 2 = 0. The point (2, 0) and (0, 2) determine the line.",
      [
        ["(2, 4)", "The x-term is negative."],
        ["(0, 2)", "That is the earlier point for x = 0."],
      ],
      ["Calculate the output for x = 2.", "Pair x = 2 with the calculated y."],
    ],
  ]),
  g("guided-features", "domain-range-intercepts", [
    [
      "g-features-y",
      "domain-range-intercepts",
      "y = 3x − 6",
      "To find the y-intercept, what do we set to zero?",
      "x",
      "Points on the y-axis have x = 0. This gives (0, −6).",
      [
        ["y", "Setting y = 0 finds the x-intercept."],
        [
          "The slope",
          "The slope stays 3. Change the input, not the coefficient.",
        ],
      ],
      [
        "Think about a point on the vertical axis.",
        "Every point on the y-axis has x = 0.",
      ],
    ],
    [
      "g-features-x",
      "domain-range-intercepts",
      "0 = 3x − 6",
      "What is the x-intercept?",
      "(2, 0)",
      "Add 6: 3x = 6. Divide by 3: x = 2, so the point is (2, 0).",
      [
        ["(0, −6)", "That is the y-intercept, found in the earlier step."],
        ["(6, 0)", "Divide 6 by the coefficient 3."],
      ],
      ["Solve the equation for x.", "Keep y = 0 in the ordered pair."],
    ],
  ]),
  g("guided-rise", "slope-graphs", [
    [
      "g-rise",
      "slope-graphs",
      "From A to B: right 3, up 2",
      "Which change is the rise?",
      "2",
      "Rise is the vertical change. Up 2 gives +2.",
      [
        ["3", "3 is the horizontal run."],
        ["−2", "Up is a positive vertical change."],
      ],
      ["Rise means change in y.", "Separate up/down from left/right."],
    ],
    [
      "g-rise-ratio",
      "slope-graphs",
      "Rise = 2; run = 3",
      "What is m?",
      "2/3",
      "Use rise / run: 2/3. Both changes are positive.",
      [
        ["3/2", "Keep vertical change in the numerator."],
        ["5", "A rate is a ratio, not a sum."],
      ],
      ["Write rise over run.", "Put 2 above 3."],
    ],
  ]),
  g("guided-points", "slope-points-tables", [
    [
      "g-points-order",
      "slope-points-tables",
      "A(−1, 4), B(3, −4)",
      "Which substitution keeps the point order consistent?",
      "(−4 − 4) / (3 − (−1))",
      "Use B minus A for both the y-difference and x-difference.",
      [
        [
          "(4 − (−4)) / (3 − (−1))",
          "The numerator uses A minus B but the denominator uses B minus A. Keep their order the same.",
        ],
        ["(3 − (−1)) / (−4 − 4)", "Slope is y-change over x-change."],
      ],
      [
        "Use (y₂ − y₁)/(x₂ − x₁).",
        "Choose the same point as point 2 in both differences.",
      ],
    ],
    [
      "g-points-result",
      "slope-points-tables",
      "m = −8 / 4",
      "What is the simplified slope?",
      "−2",
      "−8 / 4 = −2. The line falls as x increases.",
      [
        ["2", "The numerator is negative."],
        ["−1/2", "Do not invert the fraction."],
      ],
      [
        "Divide the magnitude 8 by 4.",
        "A negative divided by a positive stays negative.",
      ],
    ],
  ]),
  g("guided-form", "slope-intercept-form", [
    [
      "g-form-isolate",
      "slope-intercept-form",
      "3x + 2y = 8",
      "What should we do first to isolate the y-term?",
      "Subtract 3x from both sides",
      "Now 2y = −3x + 8.",
      [
        [
          "Subtract 8 from both sides",
          "That moves the constant, but leaves the x-term with y. First remove 3x.",
        ],
        ["Divide only 2y by 2", "Apply each operation to both complete sides."],
      ],
      ["Move the x-term away from y.", "Subtract the same 3x on each side."],
    ],
    [
      "g-form-divide",
      "slope-intercept-form",
      "2y = −3x + 8",
      "Divide every term by 2. What do we get?",
      "y = (−3/2)x + 4",
      "The coefficient −3 and constant 8 are both divided by 2. m = −3/2, b = 4.",
      [
        ["y = −3x + 4", "Divide the x-coefficient too."],
        ["y = (−3/2)x + 8", "Divide the constant too."],
      ],
      [
        "Divide both entire sides by 2.",
        "Apply division to both terms on the right.",
      ],
    ],
  ]),
  g("guided-context", "linear-models", [
    [
      "g-context-rule",
      "linear-models",
      "An $80 card loses $16 per visit. x = visits; y = dollars left.",
      "Which equation models the balance?",
      "y = 80 − 16x",
      "80 is the initial value; each visit changes the balance by −16.",
      [
        ["y = 16 − 80x", "Separate initial amount from change per visit."],
        ["y = 80 + 16x", "Spending decreases the remaining balance."],
      ],
      ["Identify the starting amount.", "Subtract the amount spent per visit."],
    ],
    [
      "g-context-feasible",
      "linear-models",
      "y = 80 − 16x; no debt; whole visits",
      "Which inputs are meaningful?",
      "{0, 1, 2, 3, 4, 5}",
      "At 5 visits the balance is zero. Visits must be nonnegative whole numbers, so plot separate points.",
      [
        [
          "All real numbers",
          "Negative and fractional visit counts are not meaningful, and a sixth visit would require debt.",
        ],
        [
          "{0, 16, 32, 48, 64, 80}",
          "Those are output balances, not input visit counts.",
        ],
      ],
      [
        "Find when the balance reaches zero.",
        "Keep only nonnegative whole inputs up to that point.",
      ],
    ],
  ]),
];
interface LessonContent {
  id: string;
  title: string;
  skill: SkillId;
  source: string;
  supplemental?: boolean;
  body: string;
  example: string[];
  graph: GraphSpec;
  table?: Point[];
  guided: string;
  support: string[];
  interactive?: boolean;
}
function lesson(c: LessonContent): Lesson {
  return {
    id: c.id,
    title: c.title,
    description: c.body,
    skills: [c.skill],
    source: c.source,
    supplemental: c.supplemental,
    support: c.support,
    steps: [
      {
        id: "understand",
        type: "explanation",
        title: "Understand the idea",
        body: c.body,
      },
      {
        id: "example",
        type: "example",
        title: "See it worked out",
        body: "Follow the reasoning, one step at a time.",
        lines: c.example,
        graph: c.graph,
        table: c.table,
      },
      {
        id: "visual",
        type: "visual",
        title: c.interactive
          ? "Explore slope and intercept"
          : "Connect the numbers to the graph",
        body: c.graph.description,
        graph: c.graph,
        interactive: c.interactive,
      },
      {
        id: "guided",
        type: "guided-practice",
        title: "Let’s work through it",
        body: "Choose the next move. Mistakes are a chance to understand the reasoning.",
        problemIds: [c.guided],
      },
      {
        id: "check",
        type: "checkpoint",
        title: "Your turn",
        body: "Try four original problems. Your first unassisted answer provides mastery evidence; hints and feedback remain available.",
        problemIds: independentProblems
          .filter((p) => p.steps[0].skill === c.skill)
          .slice(0, 4)
          .map((p) => p.id),
      },
    ],
  };
}
export const lessons: Lesson[] = [
  lesson({
    id: "inputs-and-coordinates",
    title: "Inputs, outputs, and coordinates",
    skill: "coordinates-tables",
    supplemental: true,
    source:
      "Supplemental bridge; original pages 1–2 unavailable and PDF file 5–6 missing. Exact missing-page topics are unverified.",
    body: "A function gives one output for each input. In (x, y), x tells how far left or right to go; y tells how far down or up. Substitute the input into the rule to find the output.",
    example: [
      "Use y = 2x + 1.",
      "For x = −1: y = 2(−1) + 1 = −1.",
      "For x = 0: y = 1. For x = 1: y = 3.",
      "Write the points (−1, −1), (0, 1), (1, 3).",
    ],
    graph: line(2, 1, "Points from y = 2x + 1 lie on one straight line.", [
      { x: -1, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 3 },
    ]),
    table: [
      { x: -1, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 3 },
    ],
    guided: "guided-input",
    support: [
      "Think of x as the number you put in and y as the number you get out.",
      "For y = 2x + 1 and input 3, double 3, then add 1: output 7.",
      "The point (3, 7) means move right 3, then up 7. Each input must have only one output.",
    ],
  }),
  lesson({
    id: "tables-to-graphs",
    title: "From a table to a linear graph",
    skill: "linear-graphs",
    source: "Ch 3 Notes pg 3-4.pdf · handwritten pages 5–6 · 3.3 Day 2",
    body: "Choose inputs, calculate outputs, and plot (x, y) points. An unrestricted linear equation continues beyond the sampled table. A viewing window is not the whole domain.",
    example: [
      "Use y = −x + 2.",
      "At x = −1, y = 3. At x = 0, y = 2. At x = 2, y = 0.",
      "Plot (−1, 3), (0, 2), and (2, 0).",
      "These points align. For the unrestricted equation, extend the line in both directions.",
    ],
    graph: line(
      -1,
      2,
      "A descending line through (−1, 3), (0, 2), and (2, 0).",
      [
        { x: -1, y: 3 },
        { x: 0, y: 2 },
        { x: 2, y: 0 },
      ],
    ),
    table: [
      { x: -1, y: 3 },
      { x: 0, y: 2 },
      { x: 2, y: 0 },
    ],
    guided: "guided-graph",
    support: [
      "Each table row becomes one point. Input first, output second.",
      "The row x = 2, y = 0 places a point two units right on the horizontal axis.",
      "Substitute into y = −x + 2: x = 2 gives y = 0. Plot (2, 0), then use another point to draw the line.",
    ],
  }),
  lesson({
    id: "constant-rate-bridge",
    title: "A constant rate connects the representations",
    skill: "linear-graphs",
    supplemental: true,
    source:
      "Supplemental bridge for missing filename pages 5–6; exact missing objectives unverified.",
    body: "A linear pattern has a constant change in output per change in input. Compare both changes, not only the output difference. Equal input steps in a linear table produce equal output steps.",
    example: [
      "For points (−2, −3), (0, 1), and (2, 5), each input step is +2 and each output step is +4.",
      "The rate is 4/2 = 2 per input unit. The output at zero is 1, so y = 2x + 1.",
      "The table, points on a straight line, and equation describe the same pattern.",
      "Contrast outputs 0, 1, 4 at inputs 0, 1, 2: equal input steps produce output changes 1 and 3. That is not a constant-rate linear pattern.",
    ],
    graph: line(2, 1, "The output rises 4 for every input increase of 2.", [
      { x: -2, y: -3 },
      { x: 0, y: 1 },
      { x: 2, y: 5 },
    ]),
    table: [
      { x: -2, y: -3 },
      { x: 0, y: 1 },
      { x: 2, y: 5 },
    ],
    guided: "guided-pattern",
    support: [
      "A rate compares the output change with the input change.",
      "Going from input 0 to 2 changes output 1 to 5. That is output change 4 over input change 2.",
      "Divide 4 by 2 to get rate 2. Because the output at zero is 1, the equation is y = 2x + 1.",
    ],
  }),
  lesson({
    id: "features-of-lines",
    title: "Domain, range, and intercepts",
    skill: "domain-range-intercepts",
    source:
      "Ch 3 Notes pg 3-4.pdf and pgs 9-10.pdf · graph features and intercepts",
    body: "Domain is the set of possible inputs x; range is possible outputs y. At an x-intercept, y = 0. At a y-intercept, x = 0. Solve for exact intercepts even when the grid does not show them clearly.",
    example: [
      "For y = 2x − 3, set x = 0: the y-intercept is (0, −3).",
      "Set y = 0: 2x = 3, so the x-intercept is (3/2, 0).",
      "This unrestricted nonhorizontal line has domain and range all real numbers.",
      "For a horizontal line y = 4, the domain is all real numbers but the range is {4}.",
    ],
    graph: line(
      2,
      -3,
      "The line crosses the y-axis at −3 and the x-axis at 1.5.",
    ),
    guided: "guided-features",
    support: [
      "Domain asks which x-values work. Range asks which y-values occur.",
      "To find where the graph touches the x-axis, set its height y to zero.",
      "For y = 2x − 3, solve 0 = 2x − 3: x = 1.5. The intercept is (1.5, 0), not (0, 1.5).",
    ],
  }),
  lesson({
    id: "slope-on-graphs",
    title: "Slope as rise over run",
    skill: "slope-graphs",
    source: "Ch 3 Notes pgs 7-8.pdf · 3.6 Day 1 · first page",
    body: "Slope compares vertical change to horizontal change: m = rise / run. Read changes in one consistent direction. Rising, falling, horizontal, and vertical lines have positive, negative, zero, and undefined slope.",
    example: [
      "From (−2, 0) to (2, 2), rise = 2 and run = 4.",
      "m = 2/4 = 1/2. The ratio stays the same between any two distinct points on this line.",
      "Horizontal: rise = 0, so m = 0.",
      "Vertical: run = 0, so slope is undefined. A vertical line is not y as a function of x.",
    ],
    graph: line(
      0.5,
      1,
      "Move right 4 and up 2 between the highlighted points.",
      [
        { x: -2, y: 0 },
        { x: 2, y: 2 },
      ],
    ),
    guided: "guided-rise",
    support: [
      "Slope tells how much y changes for a change in x.",
      "If right 2 leads to up 1, slope = 1/2. Down 1 would give −1/2.",
      "Use rise/run. Zero rise gives slope 0; zero run means division by zero, so the slope is undefined.",
    ],
  }),
  lesson({
    id: "slope-from-data",
    title: "Slope from points and tables",
    skill: "slope-points-tables",
    source: "Ch 3 Notes pgs 7-8.pdf · second page",
    body: "Use m = (y₂ − y₁)/(x₂ − x₁). Label both points and keep the subtraction order the same in the numerator and denominator. Simplify the signed fraction.",
    example: [
      "Take A(−1, 4) and B(3, −4).",
      "y-change = −4 − 4 = −8. x-change = 3 − (−1) = 4.",
      "m = −8/4 = −2.",
      "Reversing both differences gives 8/(−4) = −2 too. Reversing only one changes the sign incorrectly.",
    ],
    graph: line(-2, 2, "A line through (−1, 4) and (3, −4).", [
      { x: -1, y: 4 },
      { x: 3, y: -4 },
    ]),
    table: [
      { x: -1, y: 4 },
      { x: 1, y: 0 },
      { x: 3, y: -4 },
    ],
    guided: "guided-points",
    support: [
      "Two rows of a table are two points. Compare their changes, not just the outputs.",
      "For (0, 1) and (2, 5), y changes by 4 while x changes by 2. Slope = 2.",
      "Write (5 − 1)/(2 − 0) = 4/2 = 2. Keep the same point second in both differences.",
    ],
  }),
  lesson({
    id: "slope-intercept",
    title: "Read, write, and graph y = mx + b",
    skill: "slope-intercept-form",
    source: "Ch 3 Notes pgs 9-10.pdf · 3.6 Day 2",
    body: "In y = mx + b, m is slope and b is the signed y-intercept value. Plot (0, b), then use rise/run. If y is not isolated, solve for y before reading m and b.",
    example: [
      "Start with 3x + 2y = 8.",
      "Subtract 3x: 2y = −3x + 8.",
      "Divide every term by 2: y = (−3/2)x + 4.",
      "Plot (0, 4). Move right 2 and down 3 to (2, 1), then draw the line.",
    ],
    graph: line(-1.5, 4, "Slope −3/2 and y-intercept (0, 4).", [
      { x: 0, y: 4 },
      { x: 2, y: 1 },
    ]),
    guided: "guided-form",
    interactive: true,
    support: [
      "m is how the line changes; b is where it crosses the vertical axis.",
      "For y = 2x − 1, start at (0, −1), then move right 1 and up 2.",
      "For 2x + y = 6, subtract 2x to get y = −2x + 6. Read m = −2 and b = 6.",
    ],
  }),
  lesson({
    id: "real-world-lines",
    title: "Linear models in real life",
    skill: "linear-models",
    source:
      "Ch 3 Notes pg 11.pdf · Writing & Graphing Linear Equations — Real World",
    body: "Define x and y with units. The starting amount is the intercept; change per unit is the slope. Context determines the allowed inputs. Whole visit or activity counts use separate points rather than a continuous line.",
    example: [
      "A $60 card loses $12 for each visit: x = visits; y = dollars left.",
      "y = 60 − 12x. Slope = −12 dollars per visit; y-intercept = (0, 60).",
      "No debt is allowed: x can only be 0, 1, 2, 3, 4, 5.",
      "The range is {60, 48, 36, 24, 12, 0}. After 5 visits the balance is zero: (5, 0).",
    ],
    graph: {
      model: {
        kind: "points",
        points: Array.from({ length: 6 }, (_, x) => ({ x, y: 60 - 12 * x })),
      },
      bounds: { xMin: 0, xMax: 6, yMin: 0, yMax: 72 },
      xLabel: "x · visits",
      yLabel: "y · dollars left",
      description:
        "Separate points for whole visits from 0 to 5; no negative balances or fractional visits.",
    },
    guided: "guided-context",
    support: [
      "First identify what you start with and how much changes each time.",
      "Start with $60. One visit leaves $48; two visits leave $36.",
      "Write y = 60 − 12x. Stop at x = 5 because the balance is zero. Plot dots for 0 through 5 whole visits.",
    ],
  }),
];
export const problems: Record<string, PracticeProblem> = {
  ...independentProblemMap,
  ...Object.fromEntries(guidedProblems.map((p) => [p.id, p])),
};
export const chapter3: Chapter = {
  id: "chapter-3",
  number: 3,
  title: "Linear Functions",
  description: "Connect inputs, points, slope, and real-world meaning.",
  topics: lessons
    .filter(
      (l, index) =>
        lessons.findIndex((other) => other.skills[0] === l.skills[0]) === index,
    )
    .map((l) => ({
      id: l.skills[0],
      title: l.title,
      description: l.description,
      objectives:
        l.skills[0] === "linear-models"
          ? [
              "Define variables and units",
              "Write a linear model",
              "Interpret discrete domain and range",
            ]
          : [
              "Understand the idea",
              "See a worked example",
              "Practice with guidance",
              "Check independently",
            ],
      lessons: lessons.filter((other) => other.skills[0] === l.skills[0]),
    })),
};
