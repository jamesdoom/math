import type {
  GraphSpec,
  Point,
  PracticeProblem,
  ProblemStep,
} from "../../types/practice";
import { skillIds, type SkillId } from "../../types/progress";
export const practiceSkills = skillIds;
export type PracticeSkill = SkillId;
export function line(
  m: number,
  b: number,
  description: string,
  points?: Point[],
): GraphSpec {
  return {
    model: { kind: "line", slope: m, intercept: b },
    description,
    points,
    slopeTriangle: points?.length === 2,
  };
}
export function question(
  id: string,
  skill: SkillId,
  display: string,
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
  const offset = id.length % choices.length;
  const step: ProblemStep = {
    id: "check",
    skill,
    expression: display,
    prompt,
    answer: "correct",
    explanation,
    hints: hints.map((text) => ({ text })),
    choices: [...choices.slice(offset), ...choices.slice(0, offset)],
    graph,
    table,
  };
  return {
    id,
    topicId: skill,
    mode: "independent",
    difficulty: "standard",
    problemType:
      skill === "coordinates-tables"
        ? "evaluation"
        : skill === "linear-models"
          ? "model"
          : skill.includes("slope")
            ? "slope"
            : skill === "linear-graphs"
              ? "graph"
              : "features",
    prompt: "Take one idea at a time. Hints are here if you need them.",
    steps: [step],
    answer,
    explanation,
    workedSolution: [display, ...hints, explanation],
  };
}
const q = question;
export const independentProblems: PracticeProblem[] = [
  q(
    "evaluate-parentheses",
    "coordinates-tables",
    "y = 2(x − 1) + 3; x = −2",
    "What is y?",
    "−3",
    "Inside the parentheses: −2 − 1 = −3. Multiply by 2, then add 3: −6 + 3 = −3.",
    [
      ["1", "Complete the parentheses before multiplication."],
      ["−9", "The final 3 is added, not subtracted."],
    ],
    [
      "Substitute the input inside the parentheses.",
      "Follow parentheses, multiplication, then addition.",
    ],
  ),
  q(
    "evaluate-zero",
    "coordinates-tables",
    "y = −4x + 5; x = 0",
    "Which output belongs to input zero?",
    "5",
    "−4(0) + 5 = 5. The point is (0, 5).",
    [
      ["0", "Zero cancels the x-term, but the constant remains."],
      ["−4", "−4 is the coefficient, not the output at zero."],
    ],
    ["Replace x with 0.", "Multiply first, then add the constant."],
  ),
  q(
    "graph-next-point",
    "linear-graphs",
    "A line goes through (0, 3) with slope −2.",
    "Which next point follows a run of 1?",
    "(1, 1)",
    "Move right 1 and down 2: (0 + 1, 3 − 2) = (1, 1).",
    [
      ["(1, 5)", "Negative slope moves down when moving right."],
      ["(2, 2)", "Slope −2 is rise −2 over run 1."],
    ],
    ["Write −2 as −2/1.", "Add the run to x and signed rise to y."],
  ),
  q(
    "graph-y-axis",
    "linear-graphs",
    "A line passes through (0, −2) and (2, 2).",
    "Where should its graph cross the y-axis?",
    "At (0, −2)",
    "A point with x = 0 lies on the y-axis.",
    [
      ["At (2, 2)", "That point has nonzero x and is not on the y-axis."],
      ["At (−2, 0)", "Do not swap the input and output coordinates."],
    ],
    ["The y-axis has x = 0.", "Use the listed point whose input is zero."],
  ),
  q(
    "fraction-intercept",
    "domain-range-intercepts",
    "y = 3x + 2",
    "What is the exact x-intercept?",
    "(−2/3, 0)",
    "Set y = 0: 3x = −2, so x = −2/3.",
    [
      ["(−2, 0)", "Divide −2 by the coefficient 3."],
      ["(0, 2)", "That is the y-intercept."],
    ],
    [
      "Set the output equal to zero.",
      "Solve 3x = −2 exactly; do not estimate from the grid.",
    ],
  ),
  q(
    "horizontal-intercept",
    "domain-range-intercepts",
    "y = 3",
    "Does this line have an x-intercept?",
    "No",
    "The output is always 3, never 0, so the line never crosses the x-axis.",
    [
      ["Yes: (3, 0)", "That point has output zero and does not satisfy y = 3."],
      ["Yes: (0, 3)", "That is a y-intercept, not an x-intercept."],
    ],
    [
      "An x-intercept requires y = 0.",
      "Ask whether the constant output can equal zero.",
    ],
  ),
  q(
    "slope-visual",
    "slope-graphs",
    "Read the line from left to right.",
    "Which type of slope does the line have?",
    "Negative",
    "As x increases, the line moves down.",
    [
      ["Positive", "A positive slope rises as you move right."],
      ["Undefined", "This line has horizontal change; it is not vertical."],
    ],
    ["Follow the line in increasing x.", "Observe whether y rises or falls."],
    line(-1, 1, "Line through (0, 1) and (2, −1).", [
      { x: 0, y: 1 },
      { x: 2, y: -1 },
    ]),
  ),
  q(
    "signed-run",
    "slope-graphs",
    "Move left 3 and down 6 along a line.",
    "What is the slope?",
    "2",
    "Both changes are negative: m = (−6)/(−3) = 2.",
    [
      [
        "−2",
        "A negative divided by a negative is positive. Use signed rise and signed run.",
      ],
      ["1/2", "Rise is −6 and run is −3; do not invert them."],
    ],
    [
      "Left makes the run negative; down makes the rise negative.",
      "Divide signed rise by signed run.",
    ],
  ),
  q(
    "table-horizontal",
    "slope-points-tables",
    "Three input/output rows",
    "What is the slope?",
    "0",
    "The outputs do not change. m = (4 − 4)/(2 − 0) = 0.",
    [
      ["Undefined", "The input difference is 2, not zero."],
      ["4", "4 is the constant output, not the rate of change."],
    ],
    [
      "Compare two rows.",
      "A zero numerator and nonzero denominator give zero.",
    ],
    undefined,
    [
      { x: 0, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
    ],
  ),
  q(
    "same-order",
    "slope-points-tables",
    "A(0, 1), B(2, 5)",
    "Which substitution correctly uses A minus B?",
    "(1 − 5) / (0 − 2)",
    "Both numerator and denominator use A minus B, giving −4/−2 = 2.",
    [
      [
        "(1 − 5) / (2 − 0)",
        "The numerator and denominator use different point orders.",
      ],
      ["(0 − 2) / (1 − 5)", "The x-change must be below the y-change."],
    ],
    [
      "Use the same point first in both differences.",
      "The numerator is the y-difference.",
    ],
  ),
  q(
    "form-reordered",
    "slope-intercept-form",
    "y = 7 − 3x",
    "What are m and b?",
    "m = −3, b = 7",
    "Reorder as y = −3x + 7. The x-coefficient is −3.",
    [
      [
        "m = 7, b = −3",
        "The first written number is not automatically the slope. Look for the x-term.",
      ],
      ["m = 3, b = 7", "Keep the negative sign attached to 3x."],
    ],
    [
      "Rewrite with the x-term first.",
      "Identify the signed coefficient and constant.",
    ],
  ),
  q(
    "form-all-terms",
    "slope-intercept-form",
    "x + 2y = 6",
    "What is the equation after isolating y?",
    "y = (−1/2)x + 3",
    "Subtract x, then divide both terms on the right by 2.",
    [
      ["y = −x + 3", "Divide the coefficient of x by 2 too."],
      ["y = (−1/2)x + 6", "Divide the constant by 2 too."],
    ],
    ["First obtain 2y = −x + 6.", "Divide every term by 2."],
  ),
  q(
    "context-affordable",
    "linear-models",
    "A museum charges $8 entry and $3 per activity. Budget: $23.",
    "How many whole activities are affordable?",
    "At most 5",
    "8 + 3x = 23 gives x = 5. Six activities cost $26, which exceeds the budget.",
    [
      [
        "At most 7",
        "Pay the entry fee before calculating the activity budget.",
      ],
      ["At most 15", "$15 remains for activities, but each activity costs $3."],
    ],
    [
      "Subtract the entry fee from the budget.",
      "Divide the remaining dollars by dollars per activity.",
    ],
  ),
  q(
    "context-rate-units",
    "linear-models",
    "A balance follows y = 60 − 12x; x counts visits.",
    "What does the slope mean?",
    "The balance decreases $12 per visit",
    "The slope is −12 dollars per visit. 60 dollars is the starting balance.",
    [
      [
        "The starting balance is $12",
        "The intercept 60 is the starting amount.",
      ],
      [
        "There are 60 visits",
        "60 is an output amount in dollars, not a count of visits.",
      ],
    ],
    [
      "The slope measures change in output per input unit.",
      "Use dollars per visit and preserve the negative sign.",
    ],
  ),
  q(
    "input-negative",
    "coordinates-tables",
    "y = 3x + 2; x = −2",
    "What is the output y?",
    "−4",
    "3(−2) + 2 = −6 + 2 = −4.",
    [
      ["−8", "The +2 is added after multiplying. Work out −6 + 2."],
      ["4", "Keep the negative sign when multiplying 3 by −2."],
    ],
    ["Substitute −2 for x.", "Multiply first, then add 2."],
  ),
  q(
    "input-fraction",
    "coordinates-tables",
    "y = x / 2 − 1; x = 6",
    "What is y?",
    "2",
    "6 / 2 − 1 = 3 − 1 = 2.",
    [
      [
        "2.5",
        "Divide 6 by 2 before subtracting 1; do not divide the whole expression.",
      ],
      ["4", "The formula divides x by 2, not subtracts 2."],
    ],
    ["Replace x with 6.", "Divide before subtracting."],
  ),
  q(
    "ordered-point",
    "coordinates-tables",
    "x = −3; y = 2",
    "Which ordered pair represents these values?",
    "(−3, 2)",
    "Write the input x first and output y second.",
    [
      ["(2, −3)", "Ordered pairs use (x, y). The input goes first."],
      ["(3, −2)", "Preserve the signs of both coordinates."],
    ],
    ["Use (x, y).", "Put −3 first and 2 second."],
  ),
  q(
    "function-rule",
    "coordinates-tables",
    "(1, 2), (1, 5), (2, 6)",
    "Does this relation define y as a function of x?",
    "No: input 1 has two outputs",
    "A function assigns exactly one output to each input.",
    [
      [
        "Yes: all outputs are different",
        "Different outputs are allowed. Check whether one input has more than one output.",
      ],
      [
        "No: functions cannot have negative numbers",
        "Signs do not determine whether a relation is a function.",
      ],
    ],
    ["Inspect repeated inputs.", "Input 1 is paired with both 2 and 5."],
  ),
  q(
    "graph-point",
    "linear-graphs",
    "y = 2x − 1",
    "Which point lies on this line?",
    "(2, 3)",
    "At x = 2, y = 2(2) − 1 = 3.",
    [
      ["(2, 5)", "Subtract 1 after multiplying 2 by 2."],
      ["(3, 2)", "Check the proposed x first. At x = 3 the output is 5."],
    ],
    [
      "Substitute the x-coordinate into the equation.",
      "Compare the calculated output with the y-coordinate.",
    ],
  ),
  q(
    "table-graph",
    "linear-graphs",
    "A table becomes points",
    "Which point belongs to this table?",
    "(−1, 3)",
    "The row with x = −1 has y = 3.",
    [
      ["(3, −1)", "Table inputs become x-coordinates, not y-coordinates."],
      ["(−1, −3)", "Read the output sign carefully."],
    ],
    ["Read one row at a time.", "The ordered pair is (input, output)."],
    undefined,
    [
      { x: -1, y: 3 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
    ],
  ),
  q(
    "table-rule",
    "linear-graphs",
    "Inputs and outputs",
    "Which equation matches all three rows?",
    "y = −2x + 1",
    "At x = 0, y = 1; each increase of 1 in x decreases y by 2.",
    [
      [
        "y = 2x + 1",
        "The outputs decrease as inputs increase. The slope must be negative.",
      ],
      ["y = −2x − 1", "The row at x = 0 gives the constant term."],
    ],
    [
      "Look at the output for x = 0.",
      "Compare consecutive input/output changes.",
    ],
    undefined,
    [
      { x: -1, y: 3 },
      { x: 0, y: 1 },
      { x: 1, y: -1 },
    ],
  ),
  q(
    "line-extension",
    "linear-graphs",
    "An unrestricted line y = x + 2",
    "Does the graph end at the last table entry?",
    "No: the line continues in both directions",
    "A table samples a few points. Without a context restriction the mathematical line continues.",
    [
      [
        "Yes: the table determines endpoints",
        "A short table does not restrict the possible inputs unless that restriction is stated.",
      ],
      [
        "Always draw only disconnected dots",
        "Use disconnected dots for discrete contexts. An unrestricted linear equation is continuous.",
      ],
    ],
    [
      "Distinguish a sample from a domain restriction.",
      "No restriction is given here.",
    ],
  ),
  q(
    "y-intercept",
    "domain-range-intercepts",
    "y = 2x − 4",
    "What is the y-intercept as a point?",
    "(0, −4)",
    "Set x = 0: y = −4. The y-axis has x-coordinate 0.",
    [
      ["(−4, 0)", "That point is on the x-axis. A y-intercept has x = 0."],
      ["(0, 2)", "2 is the slope, not the output at x = 0."],
    ],
    ["A y-intercept lies on the y-axis.", "Set x equal to 0."],
  ),
  q(
    "x-intercept",
    "domain-range-intercepts",
    "y = 2x − 4",
    "What is the x-intercept?",
    "(2, 0)",
    "Set y = 0: 0 = 2x − 4, so x = 2.",
    [
      [
        "(0, −4)",
        "That is the y-intercept. At the x-intercept, y must be zero.",
      ],
      ["(4, 0)", "Solve 2x = 4 by dividing by 2."],
    ],
    ["On the x-axis, y is zero.", "Solve 0 = 2x − 4."],
  ),
  q(
    "unrestricted-range",
    "domain-range-intercepts",
    "Unrestricted y = −x + 3",
    "What are the domain and range?",
    "Both are all real numbers",
    "A nonhorizontal unrestricted line extends indefinitely in x and y.",
    [
      [
        "Domain and range are −6 to 6",
        "The displayed grid is a viewing window, not a restriction on the line.",
      ],
      [
        "Domain is 3 only",
        "3 is the y-intercept. It does not restrict inputs.",
      ],
    ],
    [
      "Look for a stated restriction.",
      "This is a nonhorizontal line with no restriction.",
    ],
  ),
  q(
    "horizontal-range",
    "domain-range-intercepts",
    "y = 4",
    "What is the range?",
    "{4}",
    "Every input produces the same output 4. The domain is all real numbers, but the range is {4}.",
    [
      [
        "All real numbers",
        "A horizontal line never reaches any y other than 4.",
      ],
      ["{0}", "Zero is the slope. The constant output is 4."],
    ],
    ["Range means possible y-values.", "Every point has y = 4."],
    line(0, 4, "Horizontal line through y = 4."),
  ),
  q(
    "rise-run",
    "slope-graphs",
    "Rise = 3; run = 2",
    "What is the slope?",
    "3/2",
    "Slope is vertical change divided by horizontal change: 3 / 2.",
    [
      ["2/3", "Use rise over run, not run over rise."],
      ["5", "Slope is a ratio, not the sum of the changes."],
    ],
    ["Write rise / run.", "Use 3 for the numerator and 2 for the denominator."],
  ),
  q(
    "negative-rise",
    "slope-graphs",
    "Move right 4 and down 2",
    "What is the slope?",
    "−1/2",
    "Down 2 means rise = −2; right 4 means run = 4. Simplify −2/4.",
    [
      ["1/2", "Moving down as x increases gives a negative slope."],
      ["−2", "Include the horizontal change in the denominator."],
    ],
    ["Use signed changes.", "Simplify −2 / 4."],
  ),
  q(
    "zero-slope",
    "slope-graphs",
    "A horizontal line",
    "What is its slope?",
    "0",
    "The vertical change is zero while the horizontal change can be nonzero.",
    [
      [
        "Undefined",
        "Undefined slope comes from zero horizontal change, which describes a vertical line.",
      ],
      ["1", "A horizontal line has no rise."],
    ],
    ["Think about the vertical change.", "0 divided by a nonzero run is 0."],
    line(0, 2, "Horizontal line at y = 2."),
  ),
  q(
    "vertical-slope",
    "slope-graphs",
    "A vertical line x = 2",
    "What is its slope?",
    "Undefined",
    "The horizontal change is zero. Dividing by zero is undefined; this is not y as a function of x.",
    [
      [
        "0",
        "Zero slope means no vertical change. Here there is vertical change but no run.",
      ],
      ["2", "2 gives the line’s x-location, not its slope."],
    ],
    [
      "Find the run between two distinct points.",
      "The run is zero, so division is undefined.",
    ],
    {
      model: { kind: "vertical", x: 2 },
      description: "Vertical line through x = 2.",
    },
  ),
  q(
    "points-positive",
    "slope-points-tables",
    "A(−2, 1), B(2, 7)",
    "What is the slope?",
    "3/2",
    "m = (7 − 1) / (2 − (−2)) = 6/4 = 3/2.",
    [
      ["2/3", "Put y-change above x-change."],
      ["3", "Subtracting −2 means adding 2 in the denominator."],
    ],
    [
      "Use (y₂ − y₁)/(x₂ − x₁).",
      "Keep the same point order in both differences.",
    ],
  ),
  q(
    "points-negative",
    "slope-points-tables",
    "A(1, 5), B(4, −1)",
    "What is the slope?",
    "−2",
    "m = (−1 − 5) / (4 − 1) = −6/3 = −2.",
    [
      [
        "2",
        "The output decreases as x increases. Preserve the negative numerator.",
      ],
      ["−1/2", "Use y-change / x-change rather than its reciprocal."],
    ],
    [
      "Label the points in one consistent order.",
      "Calculate −1 − 5 and 4 − 1 separately.",
    ],
  ),
  q(
    "table-slope",
    "slope-points-tables",
    "Slope from a table",
    "What is the slope?",
    "2",
    "Using (0, 1) and (2, 5): m = (5 − 1)/(2 − 0) = 2.",
    [
      ["4", "The output change is 4, but the input change is 2. Divide them."],
      ["1/2", "Use output change divided by input change."],
    ],
    [
      "Choose two rows as points.",
      "Divide the change in y by the change in x.",
    ],
    undefined,
    [
      { x: 0, y: 1 },
      { x: 2, y: 5 },
      { x: 4, y: 9 },
    ],
  ),
  q(
    "points-vertical",
    "slope-points-tables",
    "A(−3, 2), B(−3, 8)",
    "What is the slope?",
    "Undefined",
    "m = (8 − 2)/(−3 − (−3)) = 6/0, which is undefined.",
    [
      ["0", "The numerator is 6. The denominator is zero, not the numerator."],
      ["6", "6 is only the vertical change. Slope also needs the run."],
    ],
    [
      "Check the x-coordinates.",
      "Equal x-coordinates produce a zero denominator.",
    ],
  ),
  q(
    "identify-mb",
    "slope-intercept-form",
    "y = −2x + 3",
    "Which pair gives m and b?",
    "m = −2, b = 3",
    "In y = mx + b, the coefficient of x is m and the constant is b.",
    [
      ["m = 3, b = −2", "Read the coefficient of x for slope."],
      ["m = 2, b = 3", "The negative sign is part of the coefficient."],
    ],
    [
      "Match each term with y = mx + b.",
      "Keep the sign attached to the x-coefficient.",
    ],
  ),
  q(
    "implicit-one",
    "slope-intercept-form",
    "y = x − 4",
    "What are the slope and y-intercept?",
    "m = 1; (0, −4)",
    "x means 1x. The constant −4 gives the y-intercept (0, −4).",
    [
      ["m = 0; (0, −4)", "An unwritten coefficient of x is 1, not zero."],
      ["m = 1; (−4, 0)", "The y-intercept must have x = 0."],
    ],
    ["Write x as 1x.", "Set x = 0 to find the intercept."],
  ),
  q(
    "solve-for-y",
    "slope-intercept-form",
    "2x + y = 6",
    "Which equation is in slope-intercept form?",
    "y = −2x + 6",
    "Subtract 2x from both sides to isolate y.",
    [
      ["y = 2x + 6", "Subtracting 2x gives a negative coefficient."],
      [
        "y = −2x − 6",
        "The constant 6 stays positive when subtracting only 2x.",
      ],
    ],
    ["Get y by itself.", "Subtract 2x from each side."],
  ),
  q(
    "equation-from-features",
    "slope-intercept-form",
    "Slope = 1/2; y-intercept = (0, −2)",
    "Which equation matches?",
    "y = (1/2)x − 2",
    "Use m = 1/2 and b = −2 in y = mx + b.",
    [
      ["y = −2x + 1/2", "Do not swap slope and intercept."],
      ["y = (1/2)x + 2", "The y-intercept lies below zero, so b is negative."],
    ],
    [
      "Insert the slope as the x-coefficient.",
      "Insert the y-intercept’s y-value as the constant.",
    ],
  ),
  q(
    "context-equation",
    "linear-models",
    "A museum charges $8 entry plus $3 per activity.",
    "Let x be activities and y total dollars. Which model fits?",
    "y = 8 + 3x",
    "$8 is paid once. Each activity adds $3.",
    [
      [
        "y = 3 + 8x",
        "The fixed entry fee and per-activity rate play different roles.",
      ],
      ["y = 8 − 3x", "Activities increase the cost rather than decrease it."],
    ],
    [
      "Identify the starting amount.",
      "Multiply the per-activity cost by the number of activities.",
    ],
  ),
  q(
    "context-balance",
    "linear-models",
    "A $60 balance decreases by $12 per visit.",
    "What balance remains after 3 visits?",
    "$24",
    "y = 60 − 12x; at x = 3, y = 60 − 36 = 24.",
    [
      ["$36", "$36 has been spent. Subtract it from the starting balance."],
      ["$96", "The balance decreases, so subtract the spending."],
    ],
    ["Write starting balance minus spending.", "Three visits use 3 × $12."],
  ),
  q(
    "context-domain",
    "linear-models",
    "A $60 balance decreases by $12 per visit; no debt is allowed.",
    "What is the feasible domain for visits?",
    "{0, 1, 2, 3, 4, 5}",
    "Visits are whole numbers. The balance reaches zero at 5 visits.",
    [
      [
        "All real numbers",
        "Visit counts cannot be fractional or negative, and the balance cannot go below zero.",
      ],
      [
        "{0, 12, 24, 36, 48, 60}",
        "Those are balances, which belong to the range rather than domain.",
      ],
    ],
    [
      "Domain contains input values: visit counts.",
      "Find when 60 − 12x reaches zero.",
    ],
  ),
  q(
    "context-discrete",
    "linear-models",
    "Number of activities versus total cost",
    "Should the contextual graph connect fractional activity counts?",
    "No: plot separate points",
    "Whole activity counts make the model discrete. The algebraic line can extend, but the contextual graph contains only feasible counts.",
    [
      [
        "Yes: every equation must be a continuous line",
        "The situation determines which inputs are meaningful.",
      ],
      [
        "No: because the slope is negative",
        "Discrete inputs are the reason; a positive-slope context can also be discrete.",
      ],
    ],
    [
      "Ask whether half an activity is meaningful here.",
      "Only nonnegative whole activity counts are allowed.",
    ],
  ),
];
export const classificationProblemIds = [
  "classify-table-linear",
  "classify-table-nonlinear",
  "classify-equation-linear",
  "classify-graph-u",
  "classify-graph-v",
  "classify-equation-square",
];
export const domainProblemIds = [
  "domain-tickets",
  "domain-continuous",
  "graph-continuous",
  "discrete-fractional",
  "domain-values",
  "point-satisfies-rule",
];
export const continuousLengthGraph: GraphSpec = {
  model: { kind: "line", slope: 3, intercept: 0 },
  domain: { min: 0, max: 2 },
  bounds: { xMin: -1, xMax: 3, yMin: -1, yMax: 9 },
  xLabel: "x · metres",
  yLabel: "y · dollars",
  description:
    "Every ribbon length from 0 to 2 metres is allowed; connect the points along y = 3x, including the endpoints.",
};
export const discreteTicketGraph: GraphSpec = {
  model: {
    kind: "points",
    points: Array.from({ length: 4 }, (_, x) => ({ x, y: 4 * x })),
  },
  bounds: { xMin: 0, xMax: 4, yMin: 0, yMax: 16 },
  xLabel: "x · tickets",
  yLabel: "y · dollars",
  description:
    "Only 0, 1, 2, or 3 whole tickets are allowed. Plot separate points on y = 4x; do not connect fractional counts.",
};
independentProblems.push(
  q(
    "classify-table-linear",
    "linear-graphs",
    "Input steps are not all the same",
    "Is this table consistent with a linear function?",
    "Yes: both rates are 2",
    "From x = 0 to 1, the rate is 2/1. From x = 1 to 3, it is 4/2. Both equal 2.",
    [
      [
        "No: the output differences are 2 and 4",
        "Input differences are also different. Compare output change divided by input change.",
      ],
      [
        "Yes: because outputs increase",
        "Increasing alone does not imply linearity. Check the rate of change.",
      ],
    ],
    [
      "Calculate both input differences.",
      "Compare Δy / Δx between consecutive rows.",
    ],
    undefined,
    [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 3, y: 7 },
    ],
  ),
  q(
    "classify-table-nonlinear",
    "linear-graphs",
    "Equal input steps",
    "Does this table represent a linear pattern?",
    "No: the rates are 1 and 3",
    "For equal input increases of 1, output changes are 1 and 3. The rate is not constant.",
    [
      [
        "Yes: the outputs increase",
        "Increasing output does not establish a constant rate.",
      ],
      [
        "Yes: every row is a point",
        "Every table gives points, but those points need not lie on a straight line.",
      ],
    ],
    [
      "Compare consecutive outputs for these equal input steps.",
      "The first change is 1; the next is 3.",
    ],
    undefined,
    [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 4 },
    ],
  ),
  q(
    "classify-equation-linear",
    "linear-graphs",
    "y = 5 − 2x",
    "Is this a linear function?",
    "Yes: y = −2x + 5",
    "It can be written y = mx + b with constants m = −2 and b = 5.",
    [
      [
        "No: the constant is written first",
        "Reordering terms does not change the relationship.",
      ],
      [
        "No: the coefficient is negative",
        "Negative slopes still describe straight lines.",
      ],
    ],
    ["Reorder with the x-term first.", "Compare with y = mx + b."],
  ),
  q(
    "classify-graph-u",
    "linear-graphs",
    "Inspect the entire graph",
    "Is this function linear or nonlinear?",
    "Nonlinear",
    "The graph is curved rather than a nonvertical straight line. Its rate changes.",
    [
      [
        "Linear: it is one connected graph",
        "Being connected does not make a graph a straight line.",
      ],
      [
        "Not a function: it curves",
        "A curve can still have one output per input.",
      ],
    ],
    [
      "A linear function has a nonvertical straight-line graph.",
      "Check whether the direction changes across the whole graph.",
    ],
    {
      model: { kind: "curve", shape: "quadratic", scale: 1, offset: -2 },
      description: "A smooth U-shaped graph with one output per input.",
    },
  ),
  q(
    "classify-graph-v",
    "linear-graphs",
    "Inspect both sides of this graph",
    "Is this function linear?",
    "No: it changes direction",
    "The two straight pieces form a corner. The whole function does not have one constant rate.",
    [
      [
        "Yes: each side is straight",
        "The whole graph must lie on one straight line, not two different directions.",
      ],
      [
        "No: it has negative inputs",
        "Negative inputs do not prevent a function from being linear.",
      ],
    ],
    [
      "Consider the entire graph.",
      "Compare its direction before and after the corner.",
    ],
    {
      model: { kind: "curve", shape: "absolute-value", scale: 1, offset: -2 },
      description: "A V-shaped graph with a corner at (0, −2).",
    },
  ),
  q(
    "classify-equation-square",
    "linear-graphs",
    "y = x²",
    "Is this function linear?",
    "No: its rate changes",
    "At x = 0, 1, 2 the outputs are 0, 1, 4. Equal input steps do not give equal output changes.",
    [
      [
        "Yes: there is only one variable on the right",
        "An x² term does not fit the form mx + b.",
      ],
      [
        "Yes: every x has one output",
        "That establishes a function, not necessarily a linear function.",
      ],
    ],
    [
      "Compare with y = mx + b.",
      "Test inputs 0, 1, and 2; compare the output changes.",
    ],
  ),
  q(
    "domain-tickets",
    "linear-models",
    "Tickets cost $4 each; at most 3 tickets can be purchased.",
    "What is the feasible input domain?",
    "{0, 1, 2, 3}",
    "The input counts whole tickets. Zero is allowed; fractions and counts above 3 are not.",
    [
      [
        "Every real x from 0 to 3",
        "That would include fractional ticket counts.",
      ],
      [
        "{0, 4, 8, 12}",
        "Those are costs in the range, not counts in the domain.",
      ],
    ],
    [
      "Domain means allowed inputs.",
      "Keep nonnegative whole ticket counts through 3.",
    ],
  ),
  q(
    "domain-continuous",
    "linear-models",
    "Ribbon may be cut to any length from 0 to 2 metres, endpoints included.",
    "Which statement describes the domain?",
    "Continuous: every real x from 0 to 2",
    "Lengths such as 0.2 and 1.75 metres are allowed, along with every value in between.",
    [
      [
        "Discrete: only {0, 1, 2}",
        "The situation allows any length, not just whole metres.",
      ],
      [
        "Continuous: all real numbers",
        "Negative lengths and lengths above 2 are excluded.",
      ],
    ],
    [
      "Ask whether values between whole numbers are meaningful.",
      "Respect both stated boundaries.",
    ],
  ),
  q(
    "graph-continuous",
    "linear-models",
    "Ribbon costs $3 per metre; any length from 0 to 2 metres is available.",
    "Which graph representation fits?",
    "A connected segment from (0, 0) to (2, 6)",
    "Every length in the interval is allowed. Use the corresponding continuous segment rather than dots or an unlimited line.",
    [
      [
        "Only dots at whole metre values",
        "Lengths such as 0.5 metres are also allowed.",
      ],
      [
        "An unlimited line through the origin",
        "The stated domain stops at 2 metres.",
      ],
    ],
    [
      "First determine whether inputs are continuous.",
      "Then apply the lower and upper domain limits.",
    ],
  ),
  q(
    "discrete-fractional",
    "linear-models",
    "A shop offers only 0.5 m, 1 m, or 1.5 m pre-cut pieces.",
    "Is the domain discrete or continuous?",
    "Discrete: three separate allowed lengths",
    "A discrete domain can contain fractions. Only the listed values are allowed; 0.75 m is not.",
    [
      [
        "Continuous: because 0.5 is a decimal",
        "Decimals do not automatically make a domain continuous. Are all intervening lengths allowed?",
      ],
      [
        "Discrete: decimals must be removed",
        "Keep every allowed input, including 0.5 and 1.5.",
      ],
    ],
    [
      "Check whether every length between the boundaries is available.",
      "There are only three selected lengths.",
    ],
  ),
  q(
    "domain-values",
    "linear-models",
    "Any real length x from 0 to 2 metres is allowed.",
    "Which proposed input is outside the domain?",
    "2.5 metres",
    "The upper limit is 2, so 2.5 is excluded. Fractional values inside the interval are allowed.",
    [
      ["0.5 metres", "0.5 lies inside the allowed interval."],
      ["0 metres", "The lower endpoint is explicitly included."],
    ],
    [
      "Check the stated endpoints.",
      "A continuous domain includes all values between its boundaries, not beyond them.",
    ],
  ),
  q(
    "point-satisfies-rule",
    "linear-graphs",
    "y = 3x + 1",
    "Which ordered pair makes the equation true?",
    "(2, 7)",
    "Substitute x = 2: y = 3(2) + 1 = 7. A solution point makes the equation true.",
    [
      ["(2, 6)", "Include the constant +1 after multiplying."],
      [
        "(7, 2)",
        "Use the first coordinate as input. At x = 7, the output is 22.",
      ],
    ],
    [
      "Substitute the x-coordinate from each pair.",
      "Compare the calculated output with its y-coordinate.",
    ],
  ),
);
export const independentProblemMap: Record<string, PracticeProblem> =
  Object.fromEntries(independentProblems.map((p) => [p.id, p]));
