import type { PracticeProblem, ProblemStep } from '../../types/practice';
import type { SkillId } from '../../types/progress';
import { graphFor, question } from './chapter4Practice';
export type SupportId = NonNullable<ProblemStep['supportId']>;
export interface PracticeSupport { title: string; moves: string[]; example: PracticeProblem }
const example = (...args: Parameters<typeof question>) => ({ ...question(...args), mode: 'guided' as const });
const rising = graphFor({ slope: 1, intercept: 1 });
export const practiceSupport: Record<SupportId, PracticeSupport> = {
  parts: {
    title: 'Find the number beside x',
    moves: ['Start with y = 2x + 1.', 'Match 2x with mx: the slope m is 2.', 'The separate number +1 is the intercept b.'],
    example: example('support-parts', 'identify-m-and-b', 'y = 2x + 1', 'Which number is the slope m?', '2', 'The coefficient beside x is 2.',
      [['1', '1 is the intercept at the end. Look beside x.'], ['0', 'The coefficient of x is shown as 2.']], ['Look beside x.', 'Match 2x with mx.']),
  },
  given: {
    title: 'Use two small positive numbers',
    moves: ['Given: m = 2 and b = 1. Start with y = mx + b.', 'Replace only m: y = 2x + b.', 'Replace b: y = 2x + 1.'],
    example: example('support-given', 'equation-from-information', 'm = 2; b = 1. Start with y = 2x + b.', 'Which equation replaces b with 1?', 'y = 2x + 1', 'The slope stays beside x and the intercept goes at the end.',
      [['y = x + 2', 'Keep slope 2 beside x.'], ['y = 2x − 1', 'The given intercept is positive 1.']], ['Only replace b.', 'Add positive 1 at the end.']),
  },
  'graph-crossing': {
    title: 'Find one crossing',
    moves: ['The y-axis is the vertical axis where x = 0.', 'On this example line, the point with x = 0 is (0, 1).', 'The crossing has height 1, so b = 1.'],
    example: example('support-crossing', 'equation-from-graph', 'Look for the line’s y-axis crossing.', 'Which point is on the line AND the y-axis?', '(0, 1)', 'At (0, 1), x is zero and the point is on the line.',
      [['(1, 2)', 'This point is on the line, but x is 1. The y-axis needs x = 0.'], ['(0, −1)', 'This point is on the axis but not on the line.']], ['Look where x = 0.', 'The line crosses one unit above zero.'], rising),
  },
  'graph-intercept': {
    title: 'Put one crossing into the equation',
    moves: ['This example crosses at (0, 1).', 'Its y-coordinate is 1, so b = 1.', 'Replace only b in y = mx + b: y = mx + 1.'],
    example: example('support-intercept', 'equation-from-graph', 'Crossing = (0, 1). Known: b = 1.', 'Put the intercept at the end of y = mx + b.', 'y = mx + 1', 'The height at x = 0 becomes the constant term +1.',
      [['y = mx − 1', 'The crossing is above zero, so the intercept is positive.'], ['y = x + b', 'That changes the slope slot. Replace b instead.']], ['Keep m beside x.', 'Put +1 at the end.'], { ...rising, points: [{x:0,y:1}] }),
  },
  'graph-slope': {
    title: 'Use one step right and one step up',
    moves: ['Start at (0, 1). Move to (1, 2).', 'Run = 1 to the right. Rise = 1 up.', 'Slope m = rise ÷ run = 1 ÷ 1 = 1.'],
    example: example('support-slope', 'equation-from-graph', 'Rise = 1; run = 1. Known: b = 1.', 'What is m = rise ÷ run?', '1', 'One divided by one is one. The slope is positive because the line rises as x increases.',
      [['−1', 'The line goes up when moving right, so rise is positive.'], ['0', 'The line rises; zero slope would be horizontal.']], ['Divide rise by run.', 'Calculate 1 ÷ 1.'], { ...rising, slopeTriangle: true }),
  },
  'graph-equation': {
    title: 'Connect a small graph to an equation',
    moves: ['The crossing (0, 1) gives b = 1.', 'Move right 1, up 1: m = 1 ÷ 1 = 1.', 'Use y = mx + b: y = x + 1.'],
    example: example('support-graph-equation', 'equation-from-graph', 'From this graph: m = 1; b = 1.', 'Which equation keeps slope 1 and intercept 1?', 'y = x + 1', 'The coefficient is 1 and the constant is +1.',
      [['y = −x + 1', 'The slope is positive, so use +x.'], ['y = x − 1', 'The crossing is above zero: b = +1.']], ['Use y = mx + b.', 'Use positive 1 in each slot.'], { ...rising, slopeTriangle: true }),
  },
  table: {
    title: 'Read a short table',
    moves: ['At x = 0, y = 1. This gives b = 1.', 'From (0, 1) to (1, 3): y changes by 2 while x changes by 1.', 'm = 2 ÷ 1 = 2. So y = 2x + 1.'],
    example: example('support-table', 'equation-from-table', 'Read the row with x = 0 first.', 'What is the intercept b?', '1', 'When x = 0, y = 1. That output is b.',
      [['0', '0 is the input. Read the output in that row.'], ['3', '3 belongs to input x = 1. Use the row with x = 0.']], ['Find x = 0.', 'Read y in that same row.'], undefined, [{x:0,y:1},{x:1,y:3},{x:2,y:5}]),
  },
  horizontal: {
    title: 'Use a flat line',
    moves: ['This line stays at height 2.', 'Its rise is 0, so its slope is 0.', 'y = 0x + 2 simplifies to y = 2.'],
    example: example('support-horizontal', 'horizontal-equations', 'The line stays at y = 2. Its slope is 0.', 'Which equation keeps y at 2 for every x?', 'y = 2', 'Every input gives output 2. A horizontal line has a constant y-value.',
      [['y = 2x', 'This changes y as x changes. A flat line keeps y constant.'], ['y = 0', 'The slope is 0, but the line’s height is 2.']], ['Use the line’s height.', 'There is no x-term after 0x disappears.'], graphFor({slope:0,intercept:2})),
  },
};
const supportBySkill: Record<SkillId, SupportId> = {
  'identify-m-and-b': 'parts', 'equation-from-information': 'given',
  'equation-from-graph': 'graph-equation', 'equation-from-table': 'table', 'horizontal-equations': 'horizontal',
};
export function supportFor(step: ProblemStep) { return practiceSupport[step.supportId ?? supportBySkill[step.skill]]; }
const successBySkill: Record<SkillId, string> = {
  'identify-m-and-b': 'You identified a building block of the equation.',
  'equation-from-information': 'You used the slope and intercept in this step.',
  'equation-from-graph': 'You connected the graph to its equation.',
  'equation-from-table': 'You used the table to find an equation value.',
  'horizontal-equations': 'You recognized a horizontal line’s equation.',
};
export function successFor(step: ProblemStep) { return step.successMessage ?? successBySkill[step.skill]; }
