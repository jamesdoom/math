import type { Point, PracticeProblem } from '../../types/practice';
import { graphCases, eliminationCases, scalingCases, question, systemGraph, withSystem, type EliminationCase } from './chapter5Practice';
import { combineEquations, formatPoint, formatStandard, formatSystem, lineEquation, scaleEquation, slopeIntercept, solveSystem } from '../../utils/systems';
import { formatNumber } from '../../utils/linear';
export const sessionKinds = ['graph', 'elimination', 'scaling'] as const;
export type SessionKind = (typeof sessionKinds)[number];
export const sessionInfo: Record<SessionKind, { title: string; start: string; practiced: string[] }> = {
  graph: { title: '5.1 · Find where two lines meet', start: 'Start by finding the first line’s y-axis crossing.',
    practiced: ['Plotting line A', 'Plotting line B while keeping A visible', 'Finding the point shared by both lines'] },
  elimination: { title: '5.2 · Eliminate one variable', start: 'Start by combining aligned equations.',
    practiced: ['Eliminating a variable', 'Solving the remaining equation', 'Finding the other variable and checking (x, y)'] },
  scaling: { title: '5.2 · Make matching coefficients', start: 'Start by multiplying every term in an equation.',
    practiced: ['Scaling whole equations', 'Eliminating and solving one variable', 'Finding and checking the ordered pair'] },
};
const guided = (...args: Parameters<typeof question>) => ({ ...question(...args), mode: 'guided' as const });
function attachPoints(problem: PracticeProblem, points: Point[], labels: string[]) {
  problem.steps[0].pointChoices = points.map((point, i) => ({ choiceId: i === 0 ? 'correct' : 'error' + (i - 1), point, label: labels[i] }));
  return problem;
}
const graphSessions = graphCases.map((s, i) => {
  const first = slopeIntercept(s.first), second = slopeIntercept(s.second);
  const firstPoint = {x:0,y:first.intercept}, secondPoint = {x:0,y:second.intercept};
  const interceptMove = (row: 'A' | 'B', move: number) => {
    const line = row === 'A' ? first : second, target = row === 'A' ? firstPoint : secondPoint;
    const points = [target, {x:0,y:line.intercept+2}, {x:2,y:line.intercept+2*line.slope}];
    const labels = points.map((point, index) => `${['P','Q','R'][index]}: ${formatPoint(point)}`);
    const graph = { ...systemGraph(s,row==='A'), points: row === 'B' ? [firstPoint] : [] };
    const problem = guided(`c5-session-graph-${i}-${move}`, 'graphing-systems',
      row === 'A' ? `Line A: ${lineEquation(s.first)}\nStart with its intercept; then use its slope to extend it.`
        : `Keep A: ${lineEquation(s.first)}\nLine B: ${lineEquation(s.second)}\nIts intercept is ${formatNumber(second.intercept)}.`,
      `Select line ${row}’s y-axis crossing. Use a graph point or a button.`, labels[0],
      `${formatPoint(target)} has x = 0 and lies on line ${row}. Its slope is ${formatNumber(line.slope)}. The ${row==='A'?'solid':'dashed'} line extends through points with this rise/run.`,
      [[labels[1], 'That point has x = 0, but check whether it lies on this line. Keep the intercept’s sign.'],
       [labels[2], 'That point is on the line but x is 2. A y-axis crossing has x = 0.']],
      ['The y-axis is the vertical axis where x = 0.', `For line ${row}, the constant term gives its height at x = 0.`], graph);
    problem.steps[0].successMessage = `You located line ${row}’s y-axis crossing.`;
    return attachPoints(problem,points,labels);
  };
  const result=solveSystem(s); if(result.kind!=='one')throw new Error('Expected intersection');
  const p=result.point, points=[p,{x:p.x+1,y:p.y},{x:p.x,y:p.y+1}], labels=points.map((point,j)=>`${['P','Q','R'][j]}: ${formatPoint(point)}`);
  const intersection=guided(`c5-session-graph-${i}-2`,'graphing-systems',
    `A: ${lineEquation(s.first)}\nB: ${lineEquation(s.second)}\nBoth lines stay visible.`,
    'Select the point that lies on BOTH lines. Read x first, then y.',labels[0],
    `${formatPoint(p)} is shared by both lines. In A, the left side is ${formatNumber(s.first.a*p.x+s.first.b*p.y)} = ${formatNumber(s.first.c)}. In B, it is ${formatNumber(s.second.a*p.x+s.second.b*p.y)} = ${formatNumber(s.second.c)}.`,
    [[labels[1], 'Follow both lines to the SAME point. Check the x-coordinate of the crossing.'],[labels[2], 'Check the vertical coordinate of the crossing, rather than a nearby height.']],
    ['Trace the solid and dashed lines to their common point.', 'A point on just one line does not solve the system.'],
    {...systemGraph(s),points:[firstPoint,secondPoint]});
  intersection.answer=formatPoint(p);
  intersection.steps[0].successMessage='You found the point shared by both lines.';
  return [interceptMove('A',0),interceptMove('B',1),attachPoints(intersection,points,labels)];
});
function algebraSession(s: EliminationCase, i: number, scaling: boolean): PracticeProblem[] {
  const kind=scaling?'scaling':'elimination', skill=scaling?'elimination-scaling':'elimination-add-subtract';
  const a=scaleEquation(s.first,s.factors[0]), b=scaleEquation(s.second,s.factors[1]);
  const sum=combineEquations(a,b,s.operation), solution=solveSystem(s);
  if(solution.kind!=='one')throw new Error('Expected unique solution');
  const p=solution.point, variable=sum.a===0?'y':'x', value=p[variable];
  const context=formatSystem(s), transformed={first:a,second:b};
  const first=scaling ? guided(`c5-session-${kind}-${i}-0`,skill,
    `${context}\nMultiply A by ${s.factors[0]}; B by ${s.factors[1]}.`,
    'Choose the equivalent pair. Every term and right side receives its row’s factor.',formatSystem(transformed),
    `Scaled rows:\n${formatSystem(transformed)}. The y coefficients are opposites, so adding will cancel y.`,
    [[formatSystem({first:{...a,c:s.first.c},second:{...b,c:s.second.c}}),'Apply the factor to each right-hand constant too.'],
     [formatSystem({first:{...a,b:s.first.b},second:{...b,b:s.second.b}}),'Both x and y coefficients must receive the factor. Multiplying by a negative changes every sign.']],
    ['Multiply the full row, not only the term you want to cancel.', `A uses ${s.factors[0]}; B uses ${s.factors[1]}. Keep each factor with its own row.`])
    : guided(`c5-session-${kind}-${i}-0`,skill,context,
      s.operation==='add'?'Add the aligned rows. What remains?':'Subtract ALL of B from A. What remains?',formatStandard(sum),
      `${formatStandard(sum)}. Matching opposite terms add to 0; matching equal terms subtract to 0. The right sides use the same operation.`,
      [[formatStandard({...sum,c:sum.c+2}),'Check the right-hand constants with the same operation.'],
       [formatStandard({...sum,a:sum.a===0?1:sum.a,b:sum.b===0?1:sum.b}),'A canceled term becomes zero; it is not 1x or 1y.']],
      ['Keep x, y and constants in their own columns.', s.operation==='add'?'Add opposite coefficients to cancel.':'Subtract each signed term of B, including the constant.']);
  const second=guided(`c5-session-${kind}-${i}-1`,'elimination-add-subtract',
    `${context}\n${scaling?'Scaled rows:\n'+formatSystem(transformed)+'\n':''}After ${s.operation==='add'?'adding':'A − B'}: ${formatStandard(sum)}`,
    `Solve this remaining equation. What is ${variable}?`,`${variable} = ${formatNumber(value)}`,
    `Divide both sides by ${formatNumber(sum.a===0?sum.b:sum.a)}. This gives ${variable} = ${formatNumber(value)}. Keep it for the next move.`,
    [[`${variable} = ${formatNumber(-value)}`,'Keep the signs when dividing both sides.'],[`${variable} = ${formatNumber(value+1)}`,'Check by multiplying your value by the remaining coefficient.']],
    ['Only one variable remains. Divide both sides by its coefficient.', `Solve ${formatStandard(sum)}; then keep the value visible.`]);
  const last=guided(`c5-session-${kind}-${i}-2`,'back-substitution',
    `${context}\nKnown: ${variable} = ${formatNumber(value)}. Use original A to find the other value.`,
    'Complete the solution as (x, y), then check it in both original equations.',formatPoint(p),
    `A checks: ${formatNumber(s.first.a*p.x)} + (${formatNumber(s.first.b*p.y)}) = ${formatNumber(s.first.c)}. B checks: ${formatNumber(s.second.a*p.x)} + (${formatNumber(s.second.b*p.y)}) = ${formatNumber(s.second.c)}. Solution: ${formatPoint(p)}.`,
    [[formatPoint({x:p.y,y:p.x}),'The solution is (x, y). Keep the coordinate order even if you found y first.'],
     [formatPoint({x:variable==='x'?p.x:-p.x,y:variable==='y'?p.y:-p.y}),'Keep the known value. Use its sign when replacing it in an ORIGINAL equation.']],
    ['Use an original row that still contains both variables.', `Keep ${variable} = ${formatNumber(value)}. Solve for the other letter, then write x first.`]);
  first.steps[0].successMessage=scaling?'You multiplied both sides of the equations.':'You eliminated one variable.';
  second.steps[0].successMessage='You solved the remaining one-variable equation.';
  last.steps[0].successMessage='You completed and checked an ordered pair.';
  return [first,second,last].map(problem=>withSystem(problem,s));
}
export const sessionSets: Record<SessionKind,PracticeProblem[][]> = {
  graph:graphSessions,
  elimination:eliminationCases.map((s,i)=>algebraSession(s,i,false)),
  scaling:scalingCases.map((s,i)=>algebraSession(s,i,true)),
};
