import test from 'node:test';
import assert from 'node:assert/strict';
import { chapter5, lessons, problems, guidedProblems } from '../src/data/chapters/chapter5';
import { graphCases, countCases, eliminationCases, scalingCases, independentProblems, independentProblemMap, practiceSkills } from '../src/data/chapters/chapter5Practice';
import { sessionSets, sessionKinds } from '../src/data/chapters/chapter5Sessions';
import { practiceSupport, supportFor, successFor } from '../src/data/chapters/chapter5Support';
import { formatPoint, formatStandard, solveSystem, satisfies, combineEquations, scaleEquation, slopeIntercept, type LinearSystem } from '../src/utils/systems';
import { createRound, parseRound, ROUND_STORAGE_KEY } from '../src/utils/practiceRounds';
import { createSession, parseSession, sessionMoves, loadSavedSession, saveSession, SESSION_KEY } from '../src/utils/shortSession';
import { emptyProgress, parseProgress, STORAGE_KEY } from '../src/utils/storage';
import { markProgressAssisted, recordProgressAttempt } from '../src/utils/progress';
import { mastery, masteryState } from '../src/utils/mastery';
import { defaultPreferences, parsePreferences, PREFERENCES_KEY } from '../src/utils/preferences';
import type { PracticeProblem } from '../src/types/practice';

const graphAnswers=[{x:2,y:2},{x:2,y:0},{x:1,y:2},{x:3,y:-2},{x:-2,y:-1},{x:-2,y:1}];
const eliminationAnswers=[{x:2,y:3},{x:2,y:-1},{x:2,y:1},{x:2,y:-1},{x:4,y:-2},{x:3,y:2}];
const scalingAnswers=[{x:1,y:2},{x:1,y:-1},{x:1,y:-1},{x:2,y:-1},{x:-2,y:1},{x:-2,y:2}];
function checkSolutions(systems:LinearSystem[], expected:typeof graphAnswers){systems.forEach((system,i)=>{
  const answer=solveSystem(system);assert.equal(answer.kind,'one');if(answer.kind!=='one')return;
  assert.deepEqual(answer.point,expected[i]);assert.ok(satisfies(system.first,expected[i]));assert.ok(satisfies(system.second,expected[i]));
});}
function checkProblem(problem:PracticeProblem){
  assert.ok(problem.workedSolution.length>=2);assert.ok(problem.answer);assert.ok(problem.steps.length>=1);
  for(const step of problem.steps){
    assert.equal(new Set(step.choices.map(c=>c.label)).size,step.choices.length,problem.id);
    assert.equal(step.choices.filter(c=>c.id===step.answer).length,1);
    assert.ok(step.choices.filter(c=>c.id!==step.answer).every(c=>c.misconception?.feedback));
    assert.equal(step.hints.length,2);assert.ok(supportFor(step));assert.ok(successFor(step));
    for(const target of step.pointChoices??[])assert.equal(step.choices.find(c=>c.id===target.choiceId)?.label,target.label);
  }
}

test('only supplied sections 5.1 and 5.2 define six focused lessons with resolved references',()=>{
  assert.equal(chapter5.number,5);assert.equal(chapter5.topics.length,2);assert.equal(lessons.length,6);
  assert.equal(lessons.filter(l=>l.section==='5.1').length,3);assert.equal(lessons.filter(l=>l.section==='5.2').length,3);
  for(const lesson of lessons){assert.equal(lesson.steps.length,4);assert.match(lesson.source,new RegExp(lesson.section));assert.equal(lesson.support.length,3);
    for(const step of lesson.steps)if('problemIds'in step)for(const id of step.problemIds)assert.ok(problems[id],id);
    assert.equal(lesson.steps[1].type,'example');if(lesson.steps[1].type==='example')assert.equal(lesson.steps[1].revealOneAtATime,true);
  }
});
test('36 original independent questions cover six skills evenly and keep choices and hints valid',()=>{
  assert.equal(independentProblems.length,36);assert.equal(new Set(independentProblems.map(p=>p.id)).size,36);
  for(const skill of practiceSkills){const bank=independentProblems.filter(p=>p.steps[0].skill===skill);assert.equal(bank.length,6);assert.ok(new Set(bank.map(p=>p.steps[0].choices.findIndex(c=>c.id===p.steps[0].answer))).size>1);}
  independentProblems.forEach(checkProblem);guidedProblems.forEach(checkProblem);
});
test('graph intersections match independently computed ordered pairs and both originals',()=>checkSolutions(graphCases,graphAnswers));
test('direct elimination cases have exact solutions in both original equations',()=>checkSolutions(eliminationCases,eliminationAnswers));
test('scaling one or both equations preserves independently checked solutions',()=>{
  checkSolutions(scalingCases,scalingAnswers);
  scalingCases.forEach((s,i)=>{
    const first=scaleEquation(s.first,s.factors[0]),second=scaleEquation(s.second,s.factors[1]);
    assert.ok(satisfies(first,scalingAnswers[i]));assert.ok(satisfies(second,scalingAnswers[i]));
    const combined=combineEquations(first,second,s.operation);assert.ok(combined.a===0||combined.b===0);assert.ok(combined.a!==0||combined.b!==0);
    assert.ok(satisfies(combined,scalingAnswers[i]));
  });
});
test('classification distinguishes distinct parallel and coincident lines, and matching intercepts can cross once',()=>{
  assert.deepEqual(countCases.map(s=>solveSystem(s).kind),['one','none','infinite','none','one','infinite']);
  assert.equal(slopeIntercept(countCases[0].first).intercept,slopeIntercept(countCases[0].second).intercept);
  assert.equal(solveSystem({first:{a:-2,b:1,c:-1},second:{a:1,b:1,c:5}}).kind,'one');
});
test('same-pair checks distinguish both, A only, B only, and neither',()=>{
  assert.deepEqual(independentProblems.filter(p=>p.steps[0].skill==='system-solutions').map(p=>p.answer),['Both equations','Only equation A','Only equation B','Neither equation','Both equations','Only equation A']);
});
test('equation subtraction and negative scaling change every signed term and constant',()=>{
  assert.deepEqual(combineEquations({a:2,b:-3,c:7},{a:2,b:1,c:3},'subtract'),{a:0,b:-4,c:4});
  assert.deepEqual(scaleEquation({a:1,b:-1,c:2},-1),{a:-1,b:1,c:-2});
  assert.equal(formatStandard({a:0,b:-4,c:4}),'−4y = 4');assert.equal(formatStandard({a:0.5,b:1,c:3}),'(1/2)x + y = 3');
});
test('independent combining, scaling, and final-pair answers match arithmetic proofs',()=>{
  eliminationCases.forEach((s,i)=>{
    assert.equal(independentProblemMap['c5-eliminate-'+i].answer,formatStandard(combineEquations(s.first,s.second,s.operation)));
    assert.equal(independentProblemMap['c5-finish-'+i].answer,formatPoint(eliminationAnswers[i]));
  });
  assert.equal(independentProblemMap['c5-graph-4'].answer,'y = (1/2)x');
});
test('all 18 three-move session sets are guided, coherent, and have accurate endpoints',()=>{
  for(const kind of sessionKinds){assert.equal(sessionSets[kind].length,6);for(const [i,moves]of sessionSets[kind].entries()){
    assert.equal(moves.length,3);moves.forEach(p=>{assert.equal(p.mode,'guided');checkProblem(p);});
    assert.equal(moves[2].answer,formatPoint(kind==='graph'?graphAnswers[i]:kind==='elimination'?eliminationAnswers[i]:scalingAnswers[i]));
    if(kind==='graph'){assert.equal(moves[0].steps[0].graph?.secondLine,undefined);assert.ok(moves[1].steps[0].graph?.secondLine);assert.ok(moves[2].steps[0].graph?.secondLine);}
    else moves.forEach(p=>assert.ok(p.steps[0].system));
  }}
});
test('short sessions validate saved bounds, activity, length and finished state',()=>{
  for(const kind of sessionKinds)for(const length of [1,2,3]){
    const s=createSession(0,length,kind);assert.deepEqual(parseSession(JSON.stringify(s)),s);assert.equal(sessionMoves(s),sessionSets[kind][0]);
    assert.equal(parseSession(JSON.stringify({...s,completed:length}))?.completed,length);
  }
  const s=createSession();for(const patch of [{set:100},{kind:'given'},{length:4},{completed:-1},{completed:4},{version:2}])assert.equal(parseSession(JSON.stringify({...s,...patch})),null);
  assert.equal(parseSession('broken'),null);
});
test('paused sessions survive switching activities without touching earlier chapter keys',()=>{
  const items=new Map<string,string>([['algebra-lab.chapter4.short-session.v1','old-session']]);
  const storage={getItem:(key:string)=>items.get(key)??null,setItem:(key:string,value:string)=>{items.set(key,value);}};
  const graph={...createSession(0,3,'graph'),completed:1},elimination=createSession(1,3,'elimination');
  saveSession(graph,storage);saveSession(elimination,storage);
  assert.deepEqual(loadSavedSession('graph',storage),graph);assert.deepEqual(loadSavedSession(undefined,storage),elimination);assert.equal(items.get('algebra-lab.chapter4.short-session.v1'),'old-session');
});
test('rounds stay short or balanced and prefer less-seen questions',()=>{
  const short=createRound(practiceSkills[0],{},'short',()=>0.5),mixed=createRound('mixed',{},'mixed',()=>0.5);
  assert.equal(short.problemIds.length,3);assert.equal(mixed.problemIds.length,6);assert.ok(parseRound(JSON.stringify(short)));assert.ok(parseRound(JSON.stringify(mixed)));
  assert.equal(new Set(mixed.problemIds.map(id=>independentProblemMap[id].steps[0].skill)).size,6);
  const evidence=Object.fromEntries(short.problemIds.map(id=>['old:'+id+':check','correct' as const]));
  assert.ok(createRound(practiceSkills[0],evidence,'next',()=>0.5).problemIds.every(id=>!short.problemIds.includes(id)));
  assert.equal(parseRound(JSON.stringify({...short,index:4})),null);
});
test('new Chapter 5 progress is isolated, starts at zero, and retains saved evidence',()=>{
  assert.equal(STORAGE_KEY,'algebra-lab.chapter5.progress.v1');assert.equal(ROUND_STORAGE_KEY,'algebra-lab.chapter5.practice-round.v1');assert.equal(SESSION_KEY,'algebra-lab.chapter5.short-session.v1');
  const p=emptyProgress();assert.equal(p.xp,0);assert.equal(p.completedLessons.length,0);assert.deepEqual(parseProgress(JSON.stringify(p)),p);assert.deepEqual(parseProgress('bad'),p);
  assert.equal(masteryState(p.skills['system-solutions']),'NOT_STARTED');
});
test('refreshes, assistance and retries preserve first-answer evidence and cannot farm XP',()=>{
  const attempt={skill:'system-solutions' as const,correct:false,independent:true,stepKey:'c5-pair-0:check',evidenceKey:'round:c5-pair-0:check'};
  let p=recordProgressAttempt(emptyProgress(),attempt);p=recordProgressAttempt(parseProgress(JSON.stringify(p)),{...attempt,correct:true});
  assert.equal(p.skills[attempt.skill].independentAttempts,1);assert.equal(p.skills[attempt.skill].independentCorrect,0);assert.equal(p.xp,10);
  p=markProgressAssisted(p,'assisted:c5-pair-0:check');p=recordProgressAttempt(parseProgress(JSON.stringify(p)),{...attempt,correct:true,evidenceKey:'assisted:c5-pair-0:check'});
  assert.equal(p.skills[attempt.skill].independentAttempts,1);assert.equal(p.xp,10);
  assert.equal(mastery({attempts:5,correct:4,independentAttempts:5,independentCorrect:4}),80);
});
test('support is bite-size, guided and available for every current skill; preferences stay separate',()=>{
  assert.equal(Object.keys(practiceSupport).length,6);for(const support of Object.values(practiceSupport)){assert.equal(support.moves.length,3);assert.equal(support.example.mode,'guided');checkProblem(support.example);}
  assert.equal(PREFERENCES_KEY,'algebra-lab.preferences.v1');assert.deepEqual(parsePreferences('bad'),defaultPreferences);
  assert.deepEqual(parsePreferences('{"theme":"light","reducedMotion":false,"explanations":"on-request"}'),{theme:'light',reducedMotion:false,explanations:'on-request'});
});
