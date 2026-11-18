import type { GraphSpec, PracticeProblem } from '../../types/practice';
import { skillIds, type SkillId } from '../../types/progress';
import { equation, formatNumber } from '../../utils/linear';
import { combineEquations, formatPoint, formatStandard, formatSystem, lineEquation, satisfies, scaleEquation, slopeIntercept, solveSystem, type LinearSystem } from '../../utils/systems';
export const practiceSkills = skillIds;
export type PracticeSkill = SkillId;
export function withSystem(problem: PracticeProblem, system: LinearSystem): PracticeProblem {
  return { ...problem, steps: problem.steps.map(step => ({ ...step, system,
    expression: step.expression.replace(formatSystem(system), '').trim(),
  })) };
}
export function question(
  id: string, skill: SkillId, expression: string, prompt: string, answer: string,
  explanation: string, wrong: [string, string][], hints: string[], graph?: GraphSpec,
): PracticeProblem {
  const choices = [{ id: 'correct', label: answer }, ...wrong.map(([label, feedback], i) => ({
    id: 'error' + i, label, misconception: { id: skill + ':' + id + ':error' + i, feedback },
  }))];
  const offset = Array.from(id).reduce((sum, c) => sum + c.charCodeAt(0), 0) % choices.length;
  return {
    id, topicId: skill, prompt: 'One decision at a time. Help is available.', problemType: 'system',
    difficulty: 'introductory', mode: 'independent', answer, explanation,
    steps: [{ id: 'check', skill, expression, prompt, answer: 'correct', explanation,
      choices: [...choices.slice(offset), ...choices.slice(0, offset)], hints: hints.map(text => ({ text })), graph }],
    workedSolution: [expression, ...hints, explanation],
  };
}
function fromLines(m1: number, b1: number, m2: number, b2: number): LinearSystem {
  return { first: { a: -m1, b: 1, c: b1 }, second: { a: -m2, b: 1, c: b2 } };
}
export const graphCases = [
  fromLines(1, 0, -1, 4), fromLines(1, -2, -1, 2), fromLines(2, 0, -1, 3),
  fromLines(-1, 1, 0, -2), fromLines(0.5, 0, -0.5, -2), fromLines(1, 3, -1, -1),
];
export function systemGraph(s: LinearSystem, firstOnly = false): GraphSpec {
  const first = slopeIntercept(s.first), second = slopeIntercept(s.second);
  return {
    model: { kind: 'line', ...first }, secondLine: firstOnly ? undefined : second,
    description: firstOnly
      ? `Line A (solid): ${lineEquation(s.first)}. Both axes use one unit per labeled tick.`
      : `Line A (solid): ${lineEquation(s.first)}. Line B (dashed): ${lineEquation(s.second)}. A solution lies on both lines. Both axes use one unit per labeled tick.`,
  };
}
export const countCases: LinearSystem[] = [
  fromLines(2, 1, -1, 1), fromLines(1, 1, 1, -2),
  { first: { a: -2, b: 1, c: -1 }, second: { a: -4, b: 2, c: -2 } },
  fromLines(-0.5, 2, -0.5, -1), fromLines(0, 2, 1, 2),
  { first: { a: 1, b: 2, c: 6 }, second: { a: 0.5, b: 1, c: 3 } },
];
export interface EliminationCase extends LinearSystem {
  operation: 'add' | 'subtract'; factors: [number, number];
}
export const eliminationCases: EliminationCase[] = [
  { first: {a:2,b:1,c:7}, second:{a:-2,b:3,c:5}, operation:'add', factors:[1,1] },
  { first: {a:1,b:2,c:0}, second:{a:3,b:-2,c:8}, operation:'add', factors:[1,1] },
  { first: {a:3,b:2,c:8}, second:{a:1,b:2,c:4}, operation:'subtract', factors:[1,1] },
  { first: {a:2,b:-3,c:7}, second:{a:2,b:1,c:3}, operation:'subtract', factors:[1,1] },
  { first: {a:-1,b:2,c:-8}, second:{a:1,b:1,c:2}, operation:'add', factors:[1,1] },
  { first: {a:-2,b:4,c:2}, second:{a:-2,b:1,c:-4}, operation:'subtract', factors:[1,1] },
];
export const scalingCases: EliminationCase[] = [
  { first:{a:1,b:2,c:5}, second:{a:3,b:1,c:5}, operation:'add', factors:[1,-2] },
  { first:{a:2,b:1,c:1}, second:{a:1,b:-3,c:4}, operation:'add', factors:[3,1] },
  { first:{a:3,b:2,c:1}, second:{a:2,b:-3,c:5}, operation:'add', factors:[3,2] },
  { first:{a:1,b:-1,c:3}, second:{a:2,b:3,c:1}, operation:'add', factors:[3,1] },
  { first:{a:-1,b:2,c:4}, second:{a:3,b:2,c:-4}, operation:'add', factors:[1,-1] },
  { first:{a:2,b:3,c:2}, second:{a:3,b:-2,c:-10}, operation:'add', factors:[2,3] },
];
export const solutionLabels = { one: 'One solution', none: 'No solution', infinite: 'Infinitely many solutions' };
const q = question;
const solutionProblems = graphCases.map((s, i) => {
  const solution = solveSystem(s);
  if (solution.kind !== 'one') throw new Error('Expected one solution');
  const candidates = [solution.point, {x:0,y:-2}, {x:0,y:3}, {x:0,y:0}, solution.point, {x:1,y:4}];
  const p = candidates[i];
  const a = satisfies(s.first, p), b = satisfies(s.second, p);
  const label = a && b ? 'Both equations' : a ? 'Only equation A' : b ? 'Only equation B' : 'Neither equation';
  return q('c5-pair-' + i, 'system-solutions', `${formatSystem(s)}\nTest ${formatPoint(p)}.`,
    'Which equations are true for this same ordered pair?', label,
    `In A: ${formatNumber(s.first.a)}(${formatNumber(p.x)}) + ${formatNumber(s.first.b)}(${formatNumber(p.y)}) = ${formatNumber(s.first.a*p.x+s.first.b*p.y)}; its right side is ${formatNumber(s.first.c)}. In B the left side is ${formatNumber(s.second.a*p.x+s.second.b*p.y)} and its right side is ${formatNumber(s.second.c)}. A system solution must make BOTH equations true.`,
    ['Both equations','Only equation A','Only equation B','Neither equation'].filter(v=>v!==label).map(v=>[v, 'Keep the same x and y in each equation. Check both equalities; a system solution needs both to be true.']),
    ['Use the first coordinate for x and the second for y.', 'Calculate the left side of A, then B, and compare each with its own right side.']);
});
const graphProblems = graphCases.map((s, i) => {
  if (i === 4) return q('c5-graph-' + i, 'graphing-systems', 'Line A: x − 2y = 0',
    'Before graphing, which equivalent equation has y by itself?', lineEquation(s.first),
    'Subtract x: −2y = −x. Divide EVERY term by −2: y = (1/2)x. Now its slope and intercept can be graphed.',
    [['y = 2x', 'Divide the coefficient of x by 2; do not multiply it.'], ['y = (−1/2)x', 'Both −x and −2 have negative signs. Their quotient is positive.']],
    ['First subtract x from both sides.', 'Divide −2y = −x by −2.']);
  const result = solveSystem(s);
  if (result.kind !== 'one') throw new Error('Expected an intersection');
  const p = result.point;
  return q('c5-graph-' + i, 'graphing-systems', `A: ${lineEquation(s.first)}\nB: ${lineEquation(s.second)}`,
    'Where do the solid and dashed lines meet? Read (x, y).', formatPoint(p),
    `The same point ${formatPoint(p)} lies on both lines. Substitute its two coordinates into both equations to check it.`,
    [[formatPoint({x:p.x+1,y:p.y}), 'Check the horizontal coordinate. The solution must be on BOTH lines at once.'],
     [formatPoint({x:p.x,y:p.y+1}), 'Check the height where the two lines cross, not a nearby point.']],
    ['Find the point shared by both lines.', 'Read x along the horizontal axis first, then y vertically.'], systemGraph(s));
});
const countProblems = countCases.map((s, i) => {
  const result = solveSystem(s), a = slopeIntercept(s.first), b = slopeIntercept(s.second);
  const reason = result.kind === 'one' ? 'Different slopes meet once, even when the intercepts match.' : result.kind === 'none'
    ? 'Equal slopes with different intercepts make distinct parallel lines. They never meet.'
    : 'Equal slopes AND equal intercepts describe the same line. Every point on that line works for both equations.';
  return q('c5-count-' + i, 'solution-count', formatSystem(s), 'How many solutions does this system have?', solutionLabels[result.kind],
    `A becomes ${equation(a.slope,a.intercept)}; B becomes ${equation(b.slope,b.intercept)}. ${reason}`,
    Object.values(solutionLabels).filter(v=>v!==solutionLabels[result.kind]).map(v=>[v, 'Compare slopes first. If they match, compare intercepts too. Matching slopes alone does not decide between none and infinitely many.']),
    ['Put each equation into y = mx + b before comparing.', 'Different slopes: one. Same slope and different intercept: none. Same slope and same intercept: infinitely many.']);
});
const eliminationProblems = eliminationCases.map((s,i) => {
  const sum=combineEquations(s.first,s.second,s.operation);
  const wrongConstant={...sum,c:sum.c+2}, wrongVariable={...sum,a:sum.a===0?1:sum.a,b:sum.b===0?1:sum.b};
  return q('c5-eliminate-'+i,'elimination-add-subtract',formatSystem(s),
    s.operation==='add' ? 'Add A and B, matching x with x, y with y, and constants with constants.' : 'Subtract the ENTIRE equation B from A. What remains?',
    formatStandard(sum), `${s.operation==='add'?'Adding':'Subtracting B from A gives'}: ${formatStandard(sum)}. The matching variable cancels to 0. Both sides use the same operation.`,
    [[formatStandard(wrongConstant),'The variable terms are combined, but check the right-hand constants with the same operation.'],
     [formatStandard(wrongVariable),'A term plus its opposite, or a term minus itself, is 0. It disappears completely.']],
    ['Line up the x terms, y terms, and constants in columns.', s.operation==='subtract'?'Subtract every term of B, including its sign and the constant.':'Opposite coefficients add to zero. Add the right sides too.']);
});
const scalingProblems=scalingCases.map((s,i)=>{
  const row=s.factors[1]!==1?1:0, original=row===0?s.first:s.second, factor=s.factors[row];
  const scaled=scaleEquation(original,factor);
  return q('c5-scale-'+i,'elimination-scaling',`${formatSystem(s)}\nMultiply equation ${row===0?'A':'B'} by ${factor}.`,
    'Which equation multiplies EVERY term and the right side?',formatStandard(scaled),
    `Multiply ${formatStandard(original)} by ${factor}: ${formatStandard(scaled)}. Multiply the x-term, y-term, AND constant. This preserves the solutions.`,
    [[formatStandard({...scaled,c:original.c}),'You multiplied the variable terms but left the right side unchanged. Multiply the constant too.'],
     [formatStandard({...scaled,b:original.b}),'The y-term needs the same factor as the x-term and right side. Negative factors change every sign.']],
    ['Apply the factor to all three numbers, including the right-hand constant.', `Use ${factor} × (${original.a}), ${factor} × (${original.b}), and ${factor} × (${original.c}).`]);
});
const backProblems=eliminationCases.map((s,i)=>{
  const solution=solveSystem(s);if(solution.kind!=='one')throw new Error('Expected unique solution');
  const sum=combineEquations(s.first,s.second,s.operation), p=solution.point, known=sum.a===0?'y':'x';
  return q('c5-finish-'+i,'back-substitution',`${formatSystem(s)}\nElimination already gave ${known} = ${formatNumber(p[known])}.`,
    'Replace that value in either ORIGINAL equation, solve the other variable, then choose (x, y).',formatPoint(p),
    `${formatPoint(p)} checks in A: ${formatNumber(s.first.a*p.x)} + (${formatNumber(s.first.b*p.y)}) = ${formatNumber(s.first.c)}. It also checks in B: ${formatNumber(s.second.a*p.x)} + (${formatNumber(s.second.b*p.y)}) = ${formatNumber(s.second.c)}. Write x first and y second.`,
    [[formatPoint({x:p.y,y:p.x}),'You reversed the coordinates. An ordered pair is (x, y), regardless of which variable you solved first.'],
     [formatPoint({x:known==='x'?p.x:-p.x,y:known==='y'?p.y:-p.y}),'Keep the value already found. Solve the other variable with its sign, then check both original equations.']],
    ['Use an original equation that still has both variables; the combined equation has lost one.', `Keep ${known} = ${formatNumber(p[known])}, solve the other variable, then write (x, y).`]);
});
export const independentProblems: PracticeProblem[] = [...solutionProblems,...graphProblems,...countProblems,
  ...eliminationProblems.map((p,i)=>withSystem(p,eliminationCases[i])),
  ...scalingProblems.map((p,i)=>withSystem(p,scalingCases[i])),
  ...backProblems.map((p,i)=>withSystem(p,eliminationCases[i])),
];
export const independentProblemMap: Record<string,PracticeProblem> = Object.fromEntries(independentProblems.map(p=>[p.id,p]));
