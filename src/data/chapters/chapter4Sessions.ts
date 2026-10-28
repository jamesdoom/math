import { equationCases, question } from './chapter4Practice';
import { equation, formatNumber } from '../../utils/linear';

// Each session is three connected, guided moves, not three full tests.
export const sessionSets = equationCases.filter(c => c.skill === 'equation-from-information').map(c => {
  const m = formatNumber(c.slope);
  const b = String(c.intercept).replace('-', '−');
  const filled = `y = (${m})x + (${b})`;
  const make = (...args: Parameters<typeof question>) => ({ ...question(...args), mode: 'guided' as const });
  return [
    make(`session-${c.id}-m`, c.skill, `Slope = ${m}; y-intercept = ${b}`,
      'The slope is m. Which equation puts the slope beside x?', `y = (${m})x + b`,
      `The slope ${m} goes beside x. The intercept slot stays b for now.`,
      [[`y = (${b})x + b`, 'That is the intercept. Use the given slope beside x.'], [`y = (${formatNumber(-c.slope)})x + b`, 'Keep the sign of the given slope.']],
      ['Use y = mx + b. Only replace m.', `m = ${m}. Keep its sign.`]),
    make(`session-${c.id}-b`, c.skill, `m = ${m}; b = ${b}. So far: y = (${m})x + b`,
      'The intercept is b. Which equation fills that last slot?', filled,
      `Replace b with ${b}. Keep the slope beside x. Parentheses keep each signed number together.`,
      [[`y = (${m})x + (${String(-c.intercept).replace('-', '−')})`, 'Keep the intercept’s original sign.'], [`y = (${b})x + (${m})`, 'Keep m beside x and b at the end.']],
      ['Replace only b in the equation.', `b = ${b}. Leave the slope alone.`]),
    make(`session-${c.id}-write`, c.skill, `m = ${m}; b = ${b}. Filled equation: ${filled}`,
      'Keep both values and write the equation without extra parentheses.', equation(c.slope, c.intercept),
      `The equation is ${equation(c.slope, c.intercept)}. It keeps slope ${m} and intercept ${b}.`,
      [[equation(-c.slope, c.intercept), 'Check the sign of the slope beside x.'], [equation(c.slope, -c.intercept), 'Check the sign of the constant term.']],
      ['Adding a negative number is the same as subtracting it.', `Keep m = ${m} and b = ${b}. A coefficient of 1 or −1 can be written as x or −x.`]),
  ].map((problem, move) => ({ ...problem, steps: problem.steps.map(step => ({
    ...step, successMessage: [
      'You placed the slope beside x.',
      'You placed the intercept at the end.',
      'You wrote the equation using both values.',
    ][move],
  })) }));
});
