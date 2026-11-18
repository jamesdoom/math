import type { Chapter, Lesson } from '../../types/curriculum';
import type { GraphSpec, PracticeProblem } from '../../types/practice';
import type { SkillId } from '../../types/progress';
import { independentProblemMap, independentProblems, question, graphCases, countCases, systemGraph, withSystem, scalingCases, eliminationCases } from './chapter5Practice';
import { sessionSets } from './chapter5Sessions';
export const source51 = '5.1 notes pg 1-2.pdf · Solving Systems of Equations by Graphing';
export const source52 = '5.2 notes pg 3-4.pdf · Solving Systems of Equations by Elimination';
function guided(id: string, parts: PracticeProblem[]): PracticeProblem {
  return { ...parts[0], id, mode:'guided', steps:parts.flatMap((p,i)=>p.steps.map(step=>({...step,id:'step'+i}))),
    answer:parts.at(-1)!.answer, workedSolution:parts.map(p=>p.explanation) };
}
const q=question;
const pairContext='A: y = x − 1\nB: y = −x + 3\nTest (2, 1).';
const pairParts=[
  q('c5-g-pair-a','system-solutions',pairContext,'Put x = 2 into A. What output does x − 1 give?','1','2 − 1 = 1. This matches the pair’s y-coordinate.',
    [['2','Use x − 1, not just x.'],['3','Subtract 1 from 2.']],['Replace x with 2.','Calculate 2 − 1.']),
  q('c5-g-pair-b','system-solutions',pairContext+'\nA is true: 1 = 2 − 1.','Now check B with the SAME pair. What is −2 + 3?','1','−2 + 3 = 1, matching the same y-coordinate.',
    [['5','The minus sign belongs to x in −x.'],['−1','Start at −2 and add positive 3.']],['Keep x = 2 and y = 1.','Use −(2) + 3.']),
  q('c5-g-pair-both','system-solutions',pairContext+'\nA: 1 = 1. B: 1 = 1.','Does (2, 1) solve the system?','Yes, it makes both equations true','Both equalities are true for the same pair. That is what a system solution means.',
    [['No, it needs two different points','A system solution uses ONE pair shared by the equations.'],['Only equation A matters','Both equations must be true. We checked B too.']],['A system solution must satisfy both rows.','We found 1 = 1 in each row.']),
];
const countContext='A: y = 2x − 1\nB: 2y = 4x − 2';
const countParts=[
  q('c5-g-count-rewrite','solution-count',countContext,'Divide EVERY term in B by 2. What is B?','y = 2x − 1','2y/2 = y; 4x/2 = 2x; −2/2 = −1.',
    [['y = 4x − 1','Divide the x-term by 2 too.'],['y = 2x − 2','Divide the constant by 2 too.']],['Divide both sides by 2.','There are three terms to divide.']),
  q('c5-g-count-compare','solution-count','A: y = 2x − 1\nB: y = 2x − 1','What matches?','Both slope and intercept','Each has slope 2 and intercept −1. They describe the same line.',
    [['Only slope','The constant term is −1 in both equations too.'],['Neither','Compare the coefficient of x and then the constant.']],['Read m and b in each row.','Both have m = 2 and b = −1.']),
  q('c5-g-count-result','solution-count','Same slope 2. Same intercept −1. Same line.','How many points on that line satisfy both?','Infinitely many solutions','Every point on this shared line satisfies both equations. This does not mean every point in the whole plane.',
    [['No solution','Distinct parallel lines never meet. These are the same line.'],['One solution','One crossing happens with different slopes. Here all points on the line are shared.']],['The lines overlap completely.','Every point on that line works for both.'],systemGraph(countCases[2])),
];
const scaleContext='A: 3x + 2y = 1\nB: 2x − 3y = 5';
const scaleParts=[
  q('c5-g-scale-a','elimination-scaling',scaleContext,'Multiply all of A by 3.','9x + 6y = 3','3 × 3x = 9x; 3 × 2y = 6y; 3 × 1 = 3.',
    [['9x + 2y = 3','The y-term must be multiplied too.'],['9x + 6y = 1','The right-hand constant needs the same factor.']],['Multiply the full row.','Apply 3 to each term and to the right side.']),
  q('c5-g-scale-b','elimination-scaling',scaleContext+'\nScaled A: 9x + 6y = 3','Multiply all of B by 2 to make −6y.','4x − 6y = 10','The factors 3 and 2 create +6y and −6y without changing either row’s solutions.',
    [['4x − 6y = 5','Multiply the right side by 2 too.'],['4x + 6y = 10','A positive factor keeps the y-term negative.']],['Multiply x, y, and the constant.','Use 2 × (−3y) = −6y.']),
  q('c5-g-scale-add','elimination-scaling','9x + 6y = 3\n4x − 6y = 10','Add the scaled rows. What remains?','13x = 13','+6y and −6y cancel. Add 9x + 4x and 3 + 10.',
    [['13x + 12y = 13','The y terms have opposite signs. They add to zero.'],['13x = 7','Add the constants because you are adding rows.']],['Combine matching terms.','6y + (−6y) = 0.']),
  ...sessionSets.scaling[2].slice(1),
];
const finishContext='A: 3x + 2y = 8\nB: x + 2y = 4\nAlready known: x = 2.';
const finishParts=[
  q('c5-g-finish-replace','back-substitution',finishContext,'Replace x with 2 in ORIGINAL A.','6 + 2y = 8','3(2) + 2y = 8 becomes 6 + 2y = 8.',
    [['3x + 4 = 8','Replace x, not y.'],['3 + 2y = 8','3x means 3 multiplied by x.']],['Keep x = 2.','Replace only x in 3x + 2y = 8.']),
  q('c5-g-finish-isolate','back-substitution',finishContext+'\nNow: 6 + 2y = 8','Subtract 6 from both sides.','2y = 2','8 − 6 = 2. The known x-term is removed.',
    [['2y = 14','Use the inverse of +6: subtract 6.'],['y = 2','The coefficient 2 still multiplies y.']],['Undo +6 first.','Keep 2y together for now.']),
  q('c5-g-finish-value','back-substitution',finishContext+'\nNow: 2y = 2','Divide both sides by 2. What is y?','y = 1','2/2 = 1. Now x = 2 and y = 1.',
    [['y = 2','Divide the right side as well.'],['y = −1','Both sides are positive here.']],['Undo multiplication by 2.','2 ÷ 2 = 1.']),
  q('c5-g-finish-pair','back-substitution',finishContext+'\nKnown: x = 2 and y = 1.\nA checks: 6 + 2 = 8. B checks: 2 + 2 = 4.',
    'Both checks are true. Write the ordered-pair solution.','(2, 1)','Write x first, y second. The pair (2, 1) satisfies both original equations.',
    [['(1, 2)','You found the right numbers but reversed their order.'],['x = 2 only','A two-variable system solution needs both coordinates.']],['Use (x, y).','x = 2 goes first. y = 1 goes second.']),
];
export const guidedProblems = [
  guided('c5-guided-pairs',pairParts),
  guided('c5-guided-graph',sessionSets.graph[0]),
  guided('c5-guided-count',countParts),
  guided('c5-guided-eliminate',sessionSets.elimination[0]),
  guided('c5-guided-scale',scaleParts.map(p=>withSystem(p,scalingCases[2]))),
  guided('c5-guided-finish',finishParts.map(p=>withSystem(p,eliminationCases[2]))),
];
interface Content {
  id:string; section:'5.1'|'5.2'; title:string; skill:SkillId; body:string;
  example:string[]; graph?:GraphSpec; guidedId:string; support:string[];
}
function lesson(c:Content):Lesson {
  return { id:c.id, section:c.section, title:c.title, description:c.body, skills:[c.skill],
    source:c.section==='5.1'?source51:source52, support:c.support,
    steps:[
      {id:'understand',type:'explanation',title:'One idea first',body:c.body},
      {id:'example',type:'example',title:'An example in small steps',body:'Reveal one move at a time. Keep the original equations in view.',lines:c.example,graph:c.graph,revealOneAtATime:true},
      {id:'guided',type:'guided-practice',title:'Build it with help',body:'Make one small decision. Help is available.',problemIds:[c.guidedId]},
      {id:'check',type:'checkpoint',title:'Try a few yourself',body:'Three short checks. Feedback explains likely mistakes.',problemIds:independentProblems.filter(p=>p.steps[0].skill===c.skill).slice(0,3).map(p=>p.id)},
    ] };
}
export const lessons:Lesson[]=[
  lesson({id:'c5-pair-meaning',section:'5.1',title:'One pair must work in both equations',skill:'system-solutions',
    body:'A system is two equations considered together. Its solution is an ordered pair (x, y) that makes BOTH equations true. One successful check is not enough.',
    example:['A: y = x + 1. B: y = −x + 5. Test (2, 3).','The first coordinate gives x = 2; the second gives y = 3.','In A: 3 = 2 + 1. True. Keep the SAME pair.','In B: 3 = −2 + 5. True. So (2, 3) solves this system.'],
    guidedId:'c5-guided-pairs',support:['Think of two conditions. One pair must pass both.','For y = x and y = −x + 2, test (1, 1): 1 = 1 in the first row.','In the second row, 1 = −1 + 2 = 1 too. The same pair works in both rows.']}),
  lesson({id:'c5-graph-intersections',section:'5.1',title:'Graph two lines and find their meeting point',skill:'graphing-systems',
    body:'Put each equation in y = mx + b if needed. Plot its y-intercept, then use its signed slope to extend the line. Graph both on the same axes. Their shared point is the solution; read (x, y) and check both equations.',
    example:['A: x − 2y = 0. B: y = (−1/2)x − 2.','Rewrite A: −2y = −x, so y = (1/2)x. Divide every term by −2.','A starts at (0, 0). Right 2, up 1 gives (2, 1).','B starts at (0, −2). Right 2, down 1 gives (2, −3).','Extend both lines. They meet at (−2, −1).','Check: −2 − 2(−1) = 0, and −1 = (−1/2)(−2) − 2. Both true.'],
    graph:systemGraph(graphCases[4]),guidedId:'c5-guided-graph',
    support:['Graph each line on the same grid. Look for a shared point.','Plot the constant term at x = 0. For slope −1, move right 1 and down 1. A horizontal line has slope 0.','With y = x and y = −x + 2, the intersection (1, 1) works in both equations. A point on only one line is not enough.']}),
  lesson({id:'c5-count-solutions',section:'5.1',title:'One, none, or infinitely many solutions',skill:'solution-count',
    body:'Different slopes give one crossing. Equal slopes with different intercepts give distinct parallel lines and no solution. Equal slopes AND equal intercepts give the same line and infinitely many solutions. Compare equivalent y = mx + b forms first.',
    example:['A system solution is a point shared by the two lines.','y = 2x + 1 and y = −x + 1 have different slopes. They meet once at (0, 1), even though their intercepts match.','y = x + 1 and y = x − 2 have equal slopes but different intercepts. They never meet.','y = 2x − 1 and 2y = 4x − 2: divide the second row by 2.','Both rows become y = 2x − 1. The same line is drawn twice.','Infinitely many solutions means every point ON that shared line, not every point in the plane.'],
    graph:systemGraph(countCases[2]),guidedId:'c5-guided-count',
    support:['Ask how much of the two lines is shared.','One crossing: one solution. No crossing: none. Complete overlap: infinitely many.','Equal slopes alone do not decide the answer. Check the intercepts too. Different slopes always cross once for these nonvertical lines.']}),
  lesson({id:'c5-eliminate',section:'5.2',title:'Line up terms and eliminate a variable',skill:'elimination-add-subtract',
    body:'Line up x terms, y terms, and constants. Opposite coefficients add to zero; equal coefficients subtract to zero. Add or subtract BOTH sides of the equations. This leaves one variable to solve.',
    example:['A: 2x + y = 7. B: −2x + 3y = 5.','The x coefficients are opposites: 2 + (−2) = 0. Add the rows.','(2x − 2x) + (y + 3y) = 7 + 5, so 4y = 12.','Divide both sides by 4: y = 3.','Put y = 3 into original A: 2x + 3 = 7. So x = 2.','Solution (2, 3). A: 4 + 3 = 7. B: −4 + 9 = 5.'],
    guidedId:'c5-guided-eliminate',support:['Elimination combines equations so one variable becomes zero.','For x + y = 3 and −x + y = 1, adding gives 0x + 2y = 4.','Solve y = 2. Put it in the first original equation: x + 2 = 3, so x = 1. The pair is (1, 2).']}),
  lesson({id:'c5-scale-equations',section:'5.2',title:'Multiply whole equations to create opposites',skill:'elimination-scaling',
    body:'When coefficients are not ready to cancel, multiply one or both entire equations. Every term AND the right side receive the factor. Choose factors that create opposite coefficients, then add. A negative factor changes every sign.',
    example:['A: 3x + 2y = 1. B: 2x − 3y = 5. Make opposite y coefficients.','Multiply ALL of A by 3: 9x + 6y = 3.','Multiply ALL of B by 2: 4x − 6y = 10.','Add: 13x + 0y = 13. So x = 1.','Use original A: 3(1) + 2y = 1, so 2y = −2 and y = −1.','Check (1, −1): 3 − 2 = 1 and 2 + 3 = 5.'],
    guidedId:'c5-guided-scale',support:['You may scale a whole equation without changing which pairs satisfy it.','Multiply x + y = 3 by −2: −2x − 2y = −6. The constant changes too.','To match +2y against −3y, multiply the first row by 3 and the second by 2. Then +6y and −6y cancel when added.']}),
  lesson({id:'c5-finish-check',section:'5.2',title:'Find the other variable and check both',skill:'back-substitution',
    body:'Elimination finds one variable first. Keep that value visible. Replace it in an ORIGINAL equation, solve for the other variable, and write (x, y). Finally check the pair in BOTH original equations.',
    example:['A: 3x + 2y = 8. B: x + 2y = 4. Subtract B from A: 2x = 4, so x = 2.','Keep x = 2. Use ORIGINAL A: 3(2) + 2y = 8.','6 + 2y = 8. Subtract 6: 2y = 2.','Divide by 2: y = 1. Write the pair in x, y order: (2, 1).','Check A: 3(2) + 2(1) = 8. Check B: 2 + 2(1) = 4.','Both equations are true for the same pair.'],
    guidedId:'c5-guided-finish',support:['One value is only part of the answer. Use it to find the other.','If x = 1 and original A is x + y = 3, replace x: 1 + y = 3, so y = 2.','Write (1, 2), not (2, 1). Check both original rows before calling it a system solution.']}),
];
export const problems:Record<string,PracticeProblem>={...independentProblemMap,...Object.fromEntries(guidedProblems.map(p=>[p.id,p]))};
export const chapter5:Chapter={
  id:'chapter-5',number:5,title:'Systems of Equations',description:'Sections 5.1 and 5.2 · Graphing and elimination · supplied notes only',
  topics: (['5.1','5.2'] as const).map(section=>({id:'section-'+section,title:section==='5.1'?'5.1 · Solve systems by graphing':'5.2 · Solve systems by elimination',
    description:section==='5.1'?'Check shared pairs, graph both lines, and distinguish one, no, or infinitely many solutions.':'Align terms, add or subtract rows, scale whole equations, and complete and check the ordered pair.',
    objectives:section==='5.1'?['A solution satisfies both equations','Plot and read a shared point','Compare slopes and intercepts']:['Create a zero coefficient','Multiply every term when scaling','Find the second variable and check both'],
    lessons:lessons.filter(l=>l.section===section)})),
};
