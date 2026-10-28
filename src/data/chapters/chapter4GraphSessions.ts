import { graphFor, question } from './chapter4Practice';
import { equation, formatNumber } from '../../utils/linear';
import type { PracticeProblem } from '../../types/practice';

export const graphSessionCases = [
  { slope: -1, intercept: 2 }, { slope: 1, intercept: -2 },
  { slope: -2, intercept: 3 }, { slope: 2, intercept: -1 },
  { slope: -0.5, intercept: 2 }, { slope: 0, intercept: 3 },
];
export const graphSessionSets: PracticeProblem[][] = graphSessionCases.map((c, index) => {
  const b = String(c.intercept).replace('-', '−');
  const m = formatNumber(c.slope);
  const ending = c.intercept < 0 ? `− ${-c.intercept}` : `+ ${c.intercept}`;
  // A two-unit run keeps the triangle leg and labels legible on phones.
  const base = { ...graphFor(c), points: [{ x: 0, y: c.intercept }, { x: 2, y: c.intercept + 2 * c.slope }],
    bounds: { xMin: -2, xMax: 4, yMin: -4, yMax: 5 } };
  const choices = [
    { choiceId: 'correct', point: { x: 0, y: c.intercept }, label: `A: (0, ${b})` },
    { choiceId: 'error0', point: { x: 0, y: -c.intercept }, label: `B: (0, ${String(-c.intercept).replace('-', '−')})` },
    { choiceId: 'error1', point: { x: 2, y: c.intercept + c.slope * 2 }, label: `C: (2, ${String(c.intercept + c.slope * 2).replace('-', '−')})` },
  ];
  const make = (...args: Parameters<typeof question>) => ({ ...question(...args), mode: 'guided' as const });
  const crossing = make(`session-graph-${index}-crossing`, 'equation-from-graph', 'Find the intercept',
    'Select where the line crosses the y-axis. Choose a point or a button.', choices[0].label,
    `At A, x = 0 and y = ${b}. The line crosses the y-axis here, so b = ${b}.`,
    [[choices[1].label, 'That point is on the y-axis, but is it on the line? Follow the line to the vertical axis.'],
     [choices[2].label, 'That point is on the line, but its x-coordinate is 2. The y-axis has x = 0.']],
    ['The y-axis is the vertical axis through x = 0.', 'Follow the line until x = 0. Check the y-value there.'],
    { ...base, points: [], description: `Select the y-axis crossing. Candidate points: ${choices.map(p => p.label).join('; ')}. The line passes through A and C. Both axes use one unit per labeled tick.` });
  // Match authored point IDs to the question helper's stable choice IDs.
  crossing.steps[0].pointChoices = choices;
  const intercept = make(`session-graph-${index}-intercept`, 'equation-from-graph', `Known: b = ${b}. Equation: y = mx + b`,
    'The crossing stays marked. Put its y-value in the equation.', `y = mx ${ending}`,
    `The y-intercept is ${b}, so the constant term is ${ending}. The slope slot stays m.`,
    [[`y = mx ${c.intercept > 0 ? '−' : '+'} ${Math.abs(c.intercept)}`, 'Keep the sign of the y-coordinate at the marked crossing.'],
     [`y = (${b})x + b`, 'The intercept belongs at the end. The number beside x is the slope.']],
    [`Keep b = ${b} visible at the end of y = mx + b.`, 'A negative intercept means subtract; a positive intercept means add.'],
    { ...base, points: [{ x: 0, y: c.intercept }], description: `Marked crossing: (0, ${b}). Known: b = ${b}.` });
  const run = 2;
  const rise = c.slope * run;
  const slope = make(`session-graph-${index}-slope`, 'equation-from-graph', `Known: b = ${b}. Rise = ${rise}; run = ${run}. m = ${rise} ÷ ${run} = ${m}. Equation: y = __x ${ending}`,
    'Use the visible rise/run. Which slope fills the blank beside x?', m,
    `m = ${m}. The completed equation is ${equation(c.slope, c.intercept)}.`,
    [[formatNumber(c.slope === 0 ? 1 : -c.slope), c.slope === 0 ? 'The line has no vertical change. Zero divided by a nonzero run is zero.' : 'Check the signed rise. Moving down gives a negative slope; moving up gives a positive slope.'],
     [formatNumber(c.intercept), 'That is the intercept, which is already at the end. Use rise divided by run for the slope.']],
    ['Slope is signed rise divided by run.', `Use ${rise} ÷ ${run}. Keep b = ${b} at the end.`],
    { ...base, slopeTriangle: true, description: `The crossing (0, ${b}) stays marked. Move right ${run} and ${rise < 0 ? 'down' : 'up'} ${Math.abs(rise)}. Rise = ${rise}; run = ${run}; slope = ${m}.` });
  slope.answer = equation(c.slope, c.intercept);
  return [crossing, intercept, slope];
});

