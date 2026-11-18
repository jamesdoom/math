import type { PracticeProblem, ProblemStep } from '../../types/practice';
import type { SkillId } from '../../types/progress';
import { question, systemGraph } from './chapter5Practice';
export interface PracticeSupport { title:string; moves:string[]; example:PracticeProblem }
const small={first:{a:-1,b:1,c:0},second:{a:1,b:1,c:2}};
const example=(...args:Parameters<typeof question>)=>({...question(...args),mode:'guided' as const});
export const practiceSupport:Record<SkillId,PracticeSupport>={
  'system-solutions':{
    title:'One pair, two checks',moves:['A: y = x. B: y = −x + 2. Test (1, 1).','A is true: 1 = 1. Keep the same x and y.','B is true: 1 = −1 + 2. The pair works in both.'],
    example:example('c5-support-pair','system-solutions','A: y = x\nB: y = −x + 2\nTest (1, 1).','Which equations does this pair make true?','Both equations','A gives 1 = 1. B gives 1 = −1 + 2 = 1. A solution must pass both checks.',
      [['Only A','Check B too: −1 + 2 = 1.'],['Neither','Use x = 1 and y = 1 in each row. Both equalities are true.']],['Use x = 1 and y = 1.','Check A, then B.']),
  },
  'graphing-systems':{
    title:'Find a shared point',moves:['Solid A: y = x. Dashed B: y = −x + 2.','Their graphs meet at x = 1 and y = 1.','The pair (1, 1) works on both lines.'],
    example:example('c5-support-graph','graphing-systems','A: y = x\nB: y = −x + 2','Which point is shared by both lines?','(1, 1)','At (1, 1), y = x and y = −x + 2 are both true.',
      [['(0, 0)','This is on A, but B has height 2 when x = 0.'],['(0, 2)','This is on B, but A has height 0 when x = 0.']],['Look for the crossing of the solid and dashed lines.','Read x first, then y.'],systemGraph(small)),
  },
  'solution-count':{
    title:'Same direction, different starting heights',moves:['A: y = x. B: y = x + 1.','Both slopes are 1. Their intercepts are 0 and 1.','These are distinct parallel lines. No point lies on both.'],
    example:example('c5-support-count','solution-count','A: y = x\nB: y = x + 1','How many solutions are shared?','No solution','Same slope, different intercepts: the lines never meet.',
      [['One solution','One crossing requires different slopes for these nonvertical lines.'],['Infinitely many solutions','That requires the same intercept too. These heights differ.']],['Compare slopes AND intercepts.','Equal slopes with different intercepts stay apart.'],systemGraph({first:{a:-1,b:1,c:0},second:{a:-1,b:1,c:1}})),
  },
  'elimination-add-subtract':{
    title:'Make one variable disappear',moves:['A: x + y = 3. B: −x + y = 1. Line up matching terms.','Add: x + (−x) = 0, y + y = 2y, and 3 + 1 = 4.','The remaining equation is 2y = 4. Divide by 2 to get y = 2.'],
    example:example('c5-support-eliminate','elimination-add-subtract','x + y = 3\n−x + y = 1','Add the rows. What remains?','2y = 4','The x terms cancel; y + y = 2y; right sides add to 4.',
      [['x + 2y = 4','x + (−x) is zero, not x.'],['2y = 2','Add the right sides: 3 + 1 = 4.']],['Add matching columns.','x + (−x) = 0.']),
  },
  'elimination-scaling':{
    title:'Multiply every term, including the constant',moves:['Start with x − y = 2. Multiply the whole equation by −1.','The variable terms become −x and +y.','The right side becomes −2. So −x + y = −2.'],
    example:example('c5-support-scale','elimination-scaling','Multiply all of x − y = 2 by −1.','Which equivalent equation changes every term?','−x + y = −2','The same factor changes x, −y, AND the constant 2.',
      [['−x + y = 2','The right side needs the factor too: −1 × 2 = −2.'],['−x − y = −2','A negative times −y gives +y.']],['Apply −1 to all three terms.','Every sign changes when multiplying by −1.']),
  },
  'back-substitution':{
    title:'Keep one value and find the other',moves:['Original A: x + y = 3. Original B: −x + y = 1. Already known: x = 1.','Put x = 1 into A: 1 + y = 3, so y = 2.','Write (1, 2). Check B: −1 + 2 = 1. Both originals are true.'],
    example:example('c5-support-finish','back-substitution','A: x + y = 3\nB: −x + y = 1\nKnown: x = 1','Find y from A, then choose the pair in (x, y) order.','(1, 2)','1 + y = 3 gives y = 2. Check B: −1 + 2 = 1.',
      [['(2, 1)','Put x first. x is already known to be 1.'],['(1, −2)','Subtract 1 from 3 to get positive 2.']],['Keep x = 1 in view.','Use 1 + y = 3 to find y.']),
  },
};
export function supportFor(step:ProblemStep){return practiceSupport[step.supportId??step.skill];}
const successBySkill:Record<SkillId,string>={
  'system-solutions':'You checked the same pair in the equations.',
  'graphing-systems':'You used the graphing step for this system.',
  'solution-count':'You identified how many solutions the system has.',
  'elimination-add-subtract':'You combined matching terms in the equations.',
  'elimination-scaling':'You scaled the whole equation.',
  'back-substitution':'You used the known value to complete the solution.',
};
export function successFor(step:ProblemStep){return step.successMessage??successBySkill[step.skill];}
